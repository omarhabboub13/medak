import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopUpDto } from './dto/top-up.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  private async resolveWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getMyWallet(userId: string) {
    return this.resolveWallet(userId);
  }

  // Simulated top-up (in production this would confirm a payment gateway callback first)
  async topUp(userId: string, dto: TopUpDto) {
    const wallet = await this.resolveWallet(userId);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: dto.amount } },
      });
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: dto.amount,
        },
      });
      return updated;
    });
  }

  // Doctor requests a withdrawal of earnings
  async requestWithdrawal(userId: string, dto: WithdrawDto) {
    const wallet = await this.resolveWallet(userId);

    if (Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance for this withdrawal');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: dto.amount },
          ...(dto.bankAccount && { bankAccount: dto.bankAccount }),
        },
      });
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          status: 'PENDING', // an admin would mark this COMPLETED after processing
          amount: dto.amount,
        },
      });
      return updated;
    });
  }

  async getTransactions(userId: string) {
    const wallet = await this.resolveWallet(userId);
    return this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}

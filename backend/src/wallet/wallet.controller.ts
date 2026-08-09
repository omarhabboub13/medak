import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { TopUpDto } from './dto/top-up.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  getMyWallet(@Req() req: any) {
    return this.walletService.getMyWallet(req.user.userId);
  }

  @Post('top-up')
  topUp(@Req() req: any, @Body() dto: TopUpDto) {
    return this.walletService.topUp(req.user.userId, dto);
  }

  @Post('withdraw')
  requestWithdrawal(@Req() req: any, @Body() dto: WithdrawDto) {
    return this.walletService.requestWithdrawal(req.user.userId, dto);
  }

  @Get('transactions')
  getTransactions(@Req() req: any) {
    return this.walletService.getTransactions(req.user.userId);
  }
}

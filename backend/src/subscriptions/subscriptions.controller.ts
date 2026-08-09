import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { UpsertSubscriptionDto } from './dto/upsert-subscription.dto';

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('me')
  getMine(@Req() req: any) {
    return this.subscriptionsService.getMine(req.user.userId);
  }

  @Post('me')
  upsert(@Req() req: any, @Body() dto: UpsertSubscriptionDto) {
    return this.subscriptionsService.upsert(req.user.userId, dto);
  }
}

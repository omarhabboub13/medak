import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('appointments/:appointmentId')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  listMessages(@Req() req: any, @Param('appointmentId') appointmentId: string) {
    return this.chatService.listMessages(
      appointmentId,
      req.user.userId,
      req.user.role,
    );
  }

  @Post('messages')
  sendMessage(
    @Req() req: any,
    @Param('appointmentId') appointmentId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(
      appointmentId,
      req.user.userId,
      req.user.role,
      dto,
    );
  }

  @Get('attachments')
  listAttachments(
    @Req() req: any,
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.chatService.listAttachments(
      appointmentId,
      req.user.userId,
      req.user.role,
    );
  }

  @Post('attachments')
  addAttachment(
    @Req() req: any,
    @Param('appointmentId') appointmentId: string,
    @Body() body: { fileUrl: string; fileType?: string },
  ) {
    return this.chatService.addAttachment(
      appointmentId,
      req.user.userId,
      req.user.role,
      body.fileUrl,
      body.fileType,
    );
  }
}

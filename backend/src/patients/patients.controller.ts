import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  getMyProfile(@Req() req: any) {
    return this.patientsService.getMyProfile(req.user.userId);
  }

  @Patch('me')
  updateMyProfile(@Req() req: any, @Body() dto: UpdatePatientDto) {
    return this.patientsService.updateMyProfile(req.user.userId, dto);
  }
}

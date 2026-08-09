import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DoctorsService } from './doctors.service';
import { CompleteDoctorProfileDto } from './dto/complete-profile.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateSlotDto } from './dto/create-slot.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll(
    @Query('specialtyId') specialtyId?: string,
    @Query('governorate') governorate?: string,
    @Query('featured') featured?: string,
    @Query('search') search?: string,
  ) {
    return this.doctorsService.findAll({
      specialtyId,
      governorate,
      featured,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@Req() req: any) {
    return this.doctorsService.findMyProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavorites(@Req() req: any) {
    return this.doctorsService.getFavorites(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Get(':id/slots')
  getSlots(@Param('id') id: string) {
    return this.doctorsService.getSlots(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete-profile')
  completeProfile(@Req() req: any, @Body() dto: CompleteDoctorProfileDto) {
    return this.doctorsService.completeProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/slots')
  addSlot(@Param('id') id: string, @Body() dto: CreateSlotDto) {
    return this.doctorsService.addSlot(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('slots/:slotId')
  removeSlot(@Param('slotId') slotId: string) {
    return this.doctorsService.removeSlot(slotId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  toggleFavorite(@Req() req: any, @Param('id') doctorId: string) {
    return this.doctorsService.toggleFavorite(req.user.userId, doctorId);
  }
}

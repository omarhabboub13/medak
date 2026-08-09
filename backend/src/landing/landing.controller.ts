import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { LandingService } from './landing.service';
import { UpdateLandingDto } from './dto/update-landing.dto';

@Controller('landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get()
  get(@Query('lang') lang?: string) {
    return this.landingService.get(lang);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('all')
  getAll() {
    return this.landingService.getAll();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch()
  update(@Query('lang') lang: string | undefined, @Body() dto: UpdateLandingDto) {
    return this.landingService.update(lang, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('reset')
  reset(@Query('lang') lang?: string) {
    if (lang === 'all') return this.landingService.resetAll();
    return this.landingService.reset(lang);
  }
}

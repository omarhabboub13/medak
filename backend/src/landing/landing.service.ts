import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLandingDto } from './dto/update-landing.dto';
import {
  defaultLandingByLocale,
  LANDING_LOCALES,
  LandingLocale,
} from './landing.defaults';

function assertLocale(locale?: string): LandingLocale {
  const value = (locale || 'ar') as LandingLocale;
  if (!LANDING_LOCALES.includes(value)) {
    throw new BadRequestException('locale must be ar, en, or ku');
  }
  return value;
}

@Injectable()
export class LandingService {
  constructor(private prisma: PrismaService) {}

  private createData(lang: LandingLocale): Prisma.LandingPageCreateInput {
    return {
      id: lang,
      ...(defaultLandingByLocale[lang] as Omit<
        Prisma.LandingPageCreateInput,
        'id'
      >),
    };
  }

  async get(locale?: string) {
    const lang = assertLocale(locale);
    let page = await this.prisma.landingPage.findUnique({
      where: { id: lang },
    });
    if (!page) {
      page = await this.prisma.landingPage.create({
        data: this.createData(lang),
      });
    }
    return { ...page, locale: lang };
  }

  async getAll() {
    const pages: Array<Awaited<ReturnType<LandingService['get']>>> = [];
    for (const lang of LANDING_LOCALES) {
      pages.push(await this.get(lang));
    }
    return pages;
  }

  async update(locale: string | undefined, dto: UpdateLandingDto) {
    const lang = assertLocale(locale);
    await this.get(lang);
    const page = await this.prisma.landingPage.update({
      where: { id: lang },
      data: dto as Prisma.LandingPageUpdateInput,
    });
    return { ...page, locale: lang };
  }

  async reset(locale?: string) {
    const lang = assertLocale(locale);
    const existing = await this.prisma.landingPage.findUnique({
      where: { id: lang },
    });
    if (!existing) {
      const page = await this.prisma.landingPage.create({
        data: this.createData(lang),
      });
      return { ...page, locale: lang };
    }
    const page = await this.prisma.landingPage.update({
      where: { id: lang },
      data: defaultLandingByLocale[lang] as Prisma.LandingPageUpdateInput,
    });
    return { ...page, locale: lang };
  }

  async resetAll() {
    const pages: Array<Awaited<ReturnType<LandingService['reset']>>> = [];
    for (const lang of LANDING_LOCALES) {
      pages.push(await this.reset(lang));
    }
    return pages;
  }
}

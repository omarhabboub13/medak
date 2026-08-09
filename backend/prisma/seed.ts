import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  defaultLandingByLocale,
  LANDING_LOCALES,
} from '../src/landing/landing.defaults';

const prisma = new PrismaClient();

async function main() {
  // 1. Specialties
  const specialtiesData = [
    { nameAr: 'طب الأطفال', nameEn: 'Pediatrics' },
    { nameAr: 'الجلدية', nameEn: 'Dermatology' },
    { nameAr: 'الأعصاب', nameEn: 'Neurology' },
    { nameAr: 'العظام', nameEn: 'Orthopedics' },
    { nameAr: 'الأسنان', nameEn: 'Dentistry' },
  ];

const specialties: Awaited<ReturnType<typeof prisma.specialty.create>>[] = [];  for (const s of specialtiesData) {
    let specialty = await prisma.specialty.findFirst({
      where: { nameEn: s.nameEn },
    });
    if (!specialty) {
      specialty = await prisma.specialty.create({ data: s });
    }
    specialties.push(specialty);
  }

  console.log(`Seeded ${specialties.length} specialties`);

  // 2. A sample doctor
  const doctorPhone = '07700000001';
  let doctorUser = await prisma.user.findUnique({
    where: { phone: doctorPhone },
  });
  if (!doctorUser) {
    doctorUser = await prisma.user.create({
      data: {
        phone: doctorPhone,
        password: await bcrypt.hash('doctor1234', 10),
        fullName: 'د. أحمد الطبيب',
        role: 'DOCTOR',
        isVerified: true,
      },
    });
    await prisma.wallet.create({ data: { userId: doctorUser.id } });
  }

  let doctorProfile = await prisma.doctor.findUnique({
    where: { userId: doctorUser.id },
  });
  if (!doctorProfile) {
    doctorProfile = await prisma.doctor.create({
      data: {
        userId: doctorUser.id,
        specialtyId: specialties[0].id,
        bio: 'استشاري طب أطفال بخبرة 10 سنوات',
        yearsExperience: 10,
        consultFee: 25000,
        clinicAddress: 'بغداد - الكرادة',
        isApproved: true,
        isFeatured: true,
      },
    });

    await prisma.availabilitySlot.createMany({
      data: [
        {
          doctorId: doctorProfile.id,
          dayOfWeek: 0,
          startTime: '09:00',
          endTime: '17:00',
        },
        {
          doctorId: doctorProfile.id,
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
        },
        {
          doctorId: doctorProfile.id,
          dayOfWeek: 2,
          startTime: '09:00',
          endTime: '17:00',
        },
      ],
    });
  }

  console.log(
    `Seeded doctor: ${doctorUser.fullName} (${doctorPhone} / doctor1234)`,
  );

  // 3. A sample patient with a topped-up wallet
  const patientPhone = '07700000002';
  let patientUser = await prisma.user.findUnique({
    where: { phone: patientPhone },
  });
  if (!patientUser) {
    patientUser = await prisma.user.create({
      data: {
        phone: patientPhone,
        password: await bcrypt.hash('patient1234', 10),
        fullName: 'مريض تجريبي',
        role: 'PATIENT',
        isVerified: true,
      },
    });
    await prisma.patient.create({ data: { userId: patientUser.id } });
    await prisma.wallet.create({
      data: { userId: patientUser.id, balance: 100000 },
    });
  }

  console.log(
    `Seeded patient: ${patientUser.fullName} (${patientPhone} / patient1234) with 100,000 wallet balance`,
  );

  // Admin owner account for landing CMS
  const adminPhone = '07700000000';
  let adminUser = await prisma.user.findUnique({ where: { phone: adminPhone } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        phone: adminPhone,
        password: await bcrypt.hash('admin1234', 10),
        fullName: 'مدير مدك',
        role: 'ADMIN',
        isVerified: true,
      },
    });
  } else if (adminUser.role !== 'ADMIN') {
    adminUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: { role: 'ADMIN' },
    });
  }
  console.log(`Seeded admin: ${adminUser.fullName} (${adminPhone} / admin1234)`);

  // Landing CMS defaults (ar / en / ku)
  await prisma.landingPage.deleteMany({ where: { id: 'main' } }).catch(() => undefined);
  for (const locale of LANDING_LOCALES) {
    const raw = defaultLandingByLocale[locale] as Record<string, unknown>;
    const { logoUrl: _logoUrl, ...data } = raw;
    const landing = await prisma.landingPage.upsert({
      where: { id: locale },
      create: { id: locale, ...data } as never,
      update: data as never,
    });
    console.log(`Seeded landing page [${locale}]: ${landing.brandName}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

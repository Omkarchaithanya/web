import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const passwordPlain = process.env.SEED_DEFAULT_PASSWORD;
  if (!passwordPlain || passwordPlain.length < 8) {
    throw new Error('Set SEED_DEFAULT_PASSWORD (min 8 chars) in Backend/.env before seeding.');
  }

  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  const usersData = [
    {
      email: process.env.SEED_SUPER_EMAIL || 'superadmin@urbantree.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN' as const,
    },
    {
      email: process.env.SEED_GOVT_EMAIL || 'govtadmin@urbantree.com',
      name: 'Govt Admin',
      role: 'GOVT_ADMIN' as const,
    },
    {
      email: process.env.SEED_TECH_EMAIL || 'tech@urbantree.com',
      name: 'Technician',
      role: 'TECHNICIAN' as const,
    },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        passwordHash,
      },
    });
  }

  const zonesData = [
    { slug: 'koramangala', name: 'Koramangala, Bengaluru', city: 'Bengaluru', beforeAqi: 280, afterAqi: 45, lat: 12.9279, lng: 77.6271 },
    { slug: 'indiranagar', name: 'Indiranagar, Bengaluru', city: 'Bengaluru', beforeAqi: 240, afterAqi: 38, lat: 12.9719, lng: 77.6412 },
    { slug: 'whitefield', name: 'Whitefield, Bengaluru', city: 'Bengaluru', beforeAqi: 310, afterAqi: 55, lat: 12.9698, lng: 77.7499 },
    { slug: 'jayanagar', name: 'Jayanagar, Bengaluru', city: 'Bengaluru', beforeAqi: 190, afterAqi: 35, lat: 12.9295, lng: 77.5802 },
    { slug: 'electronic-city', name: 'Electronic City, Bengaluru', city: 'Bengaluru', beforeAqi: 250, afterAqi: 42, lat: 12.8399, lng: 77.6770 },
    { slug: 'malleshwaram', name: 'Malleshwaram, Bengaluru', city: 'Bengaluru', beforeAqi: 210, afterAqi: 30, lat: 13.0031, lng: 77.5643 },
  ];

  const createdZones = [];
  for (const z of zonesData) {
    const zone = await prisma.zone.upsert({
      where: { slug: z.slug },
      update: {},
      create: z,
    });
    createdZones.push(zone);
  }

  let deviceCounter = 1;
  const devicesData = [];

  for (const zone of createdZones) {
    for (let i = 0; i < 2; i++) {
      const deviceId = `AWD-${String(deviceCounter).padStart(3, '0')}`;
      devicesData.push({
        id: deviceId,
        zoneId: zone.id,
        location: `${zone.name} Sector ${i + 1}`,
        status: 'ONLINE' as const,
        firmware: 'v3.1.4',
        powerSource: 'SOLAR' as const,
        solarPercent: Math.floor(Math.random() * 20) + 80,
        batteryPercent: Math.floor(Math.random() * 30) + 70,
        lat: zone.lat! + (Math.random() - 0.5) * 0.01,
        lng: zone.lng! + (Math.random() - 0.5) * 0.01,
      });
      deviceCounter++;
    }
  }

  for (const d of devicesData) {
    await prisma.device.upsert({
      where: { id: d.id },
      update: {},
      create: d,
    });
  }

  console.log('Seed completed successfully.');
  console.log('\n--- DEV CREDENTIALS ---');
  console.log('Loaded from Backend/.env (SEED_*). Local development only.');
  for (const u of usersData) {
    console.log(`- ${u.role}: ${u.email}`);
  }
  console.log('-----------------------\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Connected successfully to PostgreSQL database via Prisma.');
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    console.error('\nTips to run PostgreSQL container:');
    console.error('  1. docker compose up -d');
    console.error('  2. pnpm prisma:push  (or pnpm prisma:migrate)');
    console.error('  3. pnpm seed\n');
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

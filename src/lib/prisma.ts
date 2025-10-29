import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma Client with proper error handling
function initializePrismaClient() {
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL is not set. Database operations will fail until configured.');
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Prisma will automatically use DATABASE_URL from environment variables
    // No need to explicitly pass datasources
  });
}

export const prisma = globalForPrisma.prisma ?? initializePrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;


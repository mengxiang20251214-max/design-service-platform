import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    }),
    log: ['error'],
  });
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      adapter: new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
      }),
      log: ['error'],
    });
  }
  prisma = (global as any).prisma;
}

export { prisma };

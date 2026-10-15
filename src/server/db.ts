import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

export type { PrismaClient };

/** Builds a client for a SQLite url such as `file:./dev.db`. Tests pass their own file. */
export function createPrismaClient(url: string): PrismaClient {
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Process-wide default client (survives Next.js dev hot reload). */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient(process.env.DATABASE_URL ?? "file:./dev.db");
  }
  return globalForPrisma.prisma;
}

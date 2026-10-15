import Database from "better-sqlite3";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createLedger, type Ledger } from "../../src/ledger";
import { createPrismaClient } from "../../src/server/db";

const MIGRATIONS_DIR = join(process.cwd(), "prisma", "migrations");

export interface TestLedger {
  ledger: Ledger;
  /** Ends the Prisma connection and deletes the temp database file. */
  cleanup: () => Promise<void>;
}

/**
 * Creates a fresh SQLite file with every migration applied, and a Ledger bound to it.
 * `now` pins the clock so tests can place "today" at any Bangkok moment.
 */
export async function createTestLedger(options: { now?: Date } = {}): Promise<TestLedger> {
  const dir = mkdtempSync(join(tmpdir(), "pft-test-"));
  const file = join(dir, "test.db");

  const raw = new Database(file);
  const folders = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const folder of folders) {
    raw.exec(readFileSync(join(MIGRATIONS_DIR, folder, "migration.sql"), "utf8"));
  }
  raw.close();

  const prisma = createPrismaClient(`file:${file}`);
  const now = options.now;
  const ledger = createLedger(prisma, now ? { now: () => now } : {});

  return {
    ledger,
    cleanup: async () => {
      await prisma.$disconnect();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

import type { PrismaClient } from "@/generated/prisma/client";
import { getPrisma } from "@/server/db";
import { listActiveCategories, type CategoryView } from "./categories";
import { seedDefaultCategories } from "./seed";
import { getMonthSummary, type MonthSummary } from "./summaries";
import { recordTransaction, type RecordTransactionInput, type TransactionView } from "./transactions";
import type { Result } from "./result";
import type { TransactionType } from "./types";

export type { CategoryView, MonthSummary, RecordTransactionInput, TransactionView, Result, TransactionType };
export type { ErrorCode, LedgerError } from "./result";
export { bangkokDay } from "./dates";
export { formatSatangAsThb, parseBahtToSatang } from "./money";

export interface LedgerOptions {
  /** Clock, injectable so tests can pin "now". Defaults to the system clock. */
  now?: () => Date;
}

export interface Ledger {
  recordTransaction(input: RecordTransactionInput): Promise<Result<TransactionView>>;
  getMonthSummary(input: { year: number; month: number }): Promise<Result<MonthSummary>>;
  listActiveCategories(type: TransactionType): Promise<CategoryView[]>;
  seedDefaultCategories(): Promise<{ seeded: boolean }>;
}

/** The one public entry of the Ledger deep module. Pass a Prisma client or use the default. */
export function createLedger(prisma: PrismaClient = getPrisma(), options: LedgerOptions = {}): Ledger {
  const now = options.now ?? (() => new Date());
  return {
    recordTransaction: (input) => recordTransaction(prisma, now(), input),
    getMonthSummary: (input) => getMonthSummary(prisma, input),
    listActiveCategories: (type) => listActiveCategories(prisma, type),
    seedDefaultCategories: () => seedDefaultCategories(prisma),
  };
}

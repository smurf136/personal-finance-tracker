import { z } from "zod";
import type { PrismaClient } from "@/generated/prisma/client";
import { monthRange } from "./dates";
import { fail, ok, type Result } from "./result";

const monthSchema = z.object({
  year: z.number().int().min(1970).max(9999),
  month: z.number().int().min(1).max(12),
});

export interface MonthSummary {
  year: number;
  month: number;
  incomeSatang: number;
  expenseSatang: number;
  /** Monthly Net: income minus expenses of this Month. Not a bank balance. */
  netSatang: number;
}

export async function getMonthSummary(prisma: PrismaClient, input: unknown): Promise<Result<MonthSummary>> {
  const parsed = monthSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION", "เดือนหรือปีไม่ถูกต้อง");
  const { year, month } = parsed.data;
  const { start, end } = monthRange(year, month);

  const groups = await prisma.transaction.groupBy({
    by: ["type"],
    where: { date: { gte: start, lt: end } },
    _sum: { amountSatang: true },
  });
  const total = (type: "INCOME" | "EXPENSE") =>
    Number(groups.find((g) => g.type === type)?._sum.amountSatang ?? 0n);

  const incomeSatang = total("INCOME");
  const expenseSatang = total("EXPENSE");
  return ok({ year, month, incomeSatang, expenseSatang, netSatang: incomeSatang - expenseSatang });
}

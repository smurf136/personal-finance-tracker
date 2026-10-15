import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import type { PrismaClient } from "@/generated/prisma/client";
import { fillTransactionDate, isValidDay } from "./dates";
import { parseBahtToSatang } from "./money";
import { fail, ok, type Result } from "./result";
import type { TransactionType } from "./types";

export const NOTE_MAX_LENGTH = 500;

const recordSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], { error: "ประเภทรายการไม่ถูกต้อง" }),
  amount: z.string({ error: "กรุณาระบุจำนวนเงิน" }),
  categoryId: z.string({ error: "กรุณาเลือกหมวดหมู่" }).min(1, "กรุณาเลือกหมวดหมู่"),
  day: z.string({ error: "กรุณาเลือกวันที่" }).refine(isValidDay, "วันที่ไม่ถูกต้อง"),
  note: z.string().max(NOTE_MAX_LENGTH, `หมายเหตุต้องไม่เกิน ${NOTE_MAX_LENGTH} ตัวอักษร`).optional(),
});

export type RecordTransactionInput = z.input<typeof recordSchema>;

export interface TransactionView {
  id: string;
  type: TransactionType;
  amountSatang: number;
  categoryId: string;
  date: Date;
  note: string | null;
}

export async function recordTransaction(
  prisma: PrismaClient,
  now: Date,
  input: unknown,
): Promise<Result<TransactionView>> {
  const parsed = recordSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION", parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง");
  }
  const { type, amount, categoryId, day, note } = parsed.data;

  const money = parseBahtToSatang(amount);
  if (!money.ok) return money;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return fail("CATEGORY_NOT_FOUND", "ไม่พบหมวดหมู่ที่เลือก");
  if (category.type !== type) {
    return fail("CATEGORY_TYPE_MISMATCH", "หมวดหมู่ไม่ตรงกับประเภทรายการ");
  }
  if (category.isArchived) {
    return fail("CATEGORY_ARCHIVED", "หมวดหมู่นี้ถูกเก็บถาวรแล้ว กรุณาเลือกหมวดหมู่อื่น");
  }

  const trimmedNote = note?.trim();
  const row = await prisma.transaction.create({
    data: {
      id: createId(),
      type,
      amountSatang: BigInt(money.value),
      categoryId,
      date: fillTransactionDate(day, now),
      note: trimmedNote ? trimmedNote : null,
    },
  });

  return ok({
    id: row.id,
    type: row.type,
    amountSatang: Number(row.amountSatang),
    categoryId: row.categoryId,
    date: row.date,
    note: row.note,
  });
}

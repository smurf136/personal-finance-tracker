"use server";

import { revalidatePath } from "next/cache";
import { createLedger } from "@/ledger";

export interface RecordExpenseState {
  ok: boolean;
  message: string;
}

/** Thin adapter: forwards to the Ledger and refreshes the home page. Never logs amounts or notes. */
export async function recordExpenseAction(input: {
  amount: string;
  categoryId: string;
  day: string;
  note?: string;
}): Promise<RecordExpenseState> {
  const result = await createLedger().recordTransaction({ type: "EXPENSE", ...input });
  if (!result.ok) return { ok: false, message: result.error.message };
  revalidatePath("/");
  return { ok: true, message: "บันทึกรายการแล้ว" };
}

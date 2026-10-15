import { createId } from "@paralleldrive/cuid2";
import type { PrismaClient } from "@/generated/prisma/client";
import type { TransactionType } from "./types";

export const FALLBACK_NAME = "อื่น ๆ";

interface DefaultCategory {
  name: string;
  type: TransactionType;
  icon: string;
  isFallback?: boolean;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: "อาหารและเครื่องดื่ม", type: "EXPENSE", icon: "coffee" },
  { name: "เดินทาง", type: "EXPENSE", icon: "car" },
  { name: "ช้อปปิ้ง", type: "EXPENSE", icon: "shopping" },
  { name: "บิลและสาธารณูปโภค", type: "EXPENSE", icon: "file-text" },
  { name: "ความบันเทิง", type: "EXPENSE", icon: "play-circle" },
  { name: "ท่องเที่ยว", type: "EXPENSE", icon: "global" },
  { name: "สุขภาพ", type: "EXPENSE", icon: "heart" },
  { name: FALLBACK_NAME, type: "EXPENSE", icon: "ellipsis", isFallback: true },
  { name: "เงินเดือน", type: "INCOME", icon: "wallet" },
  { name: "งานเสริม", type: "INCOME", icon: "laptop" },
  { name: "การลงทุน", type: "INCOME", icon: "stock" },
  { name: FALLBACK_NAME, type: "INCOME", icon: "ellipsis", isFallback: true },
];

/** Creates the default Categories only when no Category exists. Safe to run on every start. */
export async function seedDefaultCategories(prisma: PrismaClient): Promise<{ seeded: boolean }> {
  return prisma.$transaction(async (tx) => {
    if ((await tx.category.count()) > 0) return { seeded: false };
    for (const c of DEFAULT_CATEGORIES) {
      await tx.category.create({
        data: { id: createId(), name: c.name, type: c.type, icon: c.icon, isFallback: c.isFallback ?? false },
      });
    }
    return { seeded: true };
  });
}

import type { PrismaClient } from "@/generated/prisma/client";
import type { TransactionType } from "./types";

export interface CategoryView {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  isFallback: boolean;
}

export async function listActiveCategories(
  prisma: PrismaClient,
  type: TransactionType,
): Promise<CategoryView[]> {
  const rows = await prisma.category.findMany({
    where: { type, isArchived: false },
    orderBy: [{ isFallback: "asc" }, { createdAt: "asc" }, { name: "asc" }],
  });
  return rows.map((r) => ({ id: r.id, name: r.name, type: r.type, icon: r.icon, isFallback: r.isFallback }));
}

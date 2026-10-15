import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestLedger, type TestLedger } from "../helpers/db";

let t: TestLedger;
beforeEach(async () => {
  t = await createTestLedger();
});
afterEach(() => t.cleanup());

describe("default Categories", () => {
  it("seeds 8 expense and 4 income Categories with อื่น ๆ as the Fallback of each type", async () => {
    await t.ledger.seedDefaultCategories();
    const expense = await t.ledger.listActiveCategories("EXPENSE");
    const income = await t.ledger.listActiveCategories("INCOME");

    expect(expense).toHaveLength(8);
    expect(income).toHaveLength(4);
    expect(expense.filter((c) => c.isFallback).map((c) => c.name)).toEqual(["อื่น ๆ"]);
    expect(income.filter((c) => c.isFallback).map((c) => c.name)).toEqual(["อื่น ๆ"]);
    expect(expense.every((c) => c.icon.length > 0)).toBe(true);
  });

  it("is idempotent: seeding twice does not duplicate", async () => {
    const first = await t.ledger.seedDefaultCategories();
    const second = await t.ledger.seedDefaultCategories();
    expect(first).toEqual({ seeded: true });
    expect(second).toEqual({ seeded: false });
    expect(await t.ledger.listActiveCategories("EXPENSE")).toHaveLength(8);
    expect(await t.ledger.listActiveCategories("INCOME")).toHaveLength(4);
  });
});

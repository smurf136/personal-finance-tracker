import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestLedger, type TestLedger } from "../helpers/db";

let t: TestLedger;

async function expenseCategoryId(name = "อาหารและเครื่องดื่ม") {
  const cats = await t.ledger.listActiveCategories("EXPENSE");
  return cats.find((c) => c.name === name)!.id;
}
async function incomeCategoryId(name = "เงินเดือน") {
  const cats = await t.ledger.listActiveCategories("INCOME");
  return cats.find((c) => c.name === name)!.id;
}

// "Today" is 31 Oct 2026, 23:30 Bangkok (16:30 UTC).
const LATE_ON_LAST_DAY = new Date("2026-10-31T16:30:00Z");

describe("recording a Transaction and reading the Month summary", () => {
  beforeEach(async () => {
    t = await createTestLedger({ now: LATE_ON_LAST_DAY });
    await t.ledger.seedDefaultCategories();
  });
  afterEach(() => t.cleanup());

  it("sums income, expenses and Monthly Net for the Month", async () => {
    const food = await expenseCategoryId();
    const salary = await incomeCategoryId();
    await t.ledger.recordTransaction({ type: "EXPENSE", amount: "100.50", categoryId: food, day: "2026-10-15" });
    await t.ledger.recordTransaction({ type: "EXPENSE", amount: "49.50", categoryId: food, day: "2026-10-02" });
    await t.ledger.recordTransaction({ type: "INCOME", amount: "30000", categoryId: salary, day: "2026-10-01" });

    const summary = await t.ledger.getMonthSummary({ year: 2026, month: 10 });
    expect(summary).toEqual({
      ok: true,
      value: { year: 2026, month: 10, incomeSatang: 3_000_000, expenseSatang: 15_000, netSatang: 2_985_000 },
    });
  });

  it("returns zeros for an empty Month and a negative Monthly Net when only expenses exist", async () => {
    const food = await expenseCategoryId();
    await t.ledger.recordTransaction({ type: "EXPENSE", amount: "10", categoryId: food, day: "2026-09-10" });

    const empty = await t.ledger.getMonthSummary({ year: 2026, month: 8 });
    expect(empty).toEqual({ ok: true, value: { year: 2026, month: 8, incomeSatang: 0, expenseSatang: 0, netSatang: 0 } });

    const sept = await t.ledger.getMonthSummary({ year: 2026, month: 9 });
    expect(sept.ok && sept.value.netSatang).toBe(-1000);
  });

  it("counts a Transaction at 23:30 Bangkok on the last day in that Month and not the next", async () => {
    const food = await expenseCategoryId();
    // Today in Bangkok is 31 Oct 23:30, so the stored time is "now".
    const recorded = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "100", categoryId: food, day: "2026-10-31" });
    expect(recorded.ok).toBe(true);

    const october = await t.ledger.getMonthSummary({ year: 2026, month: 10 });
    const november = await t.ledger.getMonthSummary({ year: 2026, month: 11 });
    expect(october.ok && october.value.expenseSatang).toBe(10_000);
    expect(november.ok && november.value.expenseSatang).toBe(0);
  });

  it("counts a Transaction at 00:10 Bangkok on the 1st in that Month and not the previous one", async () => {
    await t.cleanup();
    t = await createTestLedger({ now: new Date("2026-10-31T17:10:00Z") }); // 1 Nov 00:10 Bangkok
    await t.ledger.seedDefaultCategories();
    const food = await expenseCategoryId();
    await t.ledger.recordTransaction({ type: "EXPENSE", amount: "100", categoryId: food, day: "2026-11-01" });

    const october = await t.ledger.getMonthSummary({ year: 2026, month: 10 });
    const november = await t.ledger.getMonthSummary({ year: 2026, month: 11 });
    expect(october.ok && october.value.expenseSatang).toBe(0);
    expect(november.ok && november.value.expenseSatang).toBe(10_000);
  });

  it("puts a Transaction on another day at 12:00 Bangkok and accepts future days", async () => {
    const food = await expenseCategoryId();
    const past = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "1", categoryId: food, day: "2026-10-01" });
    const future = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "1", categoryId: food, day: "2026-12-25" });

    expect(past.ok && past.value.date.toISOString()).toBe("2026-10-01T05:00:00.000Z");
    expect(future.ok && future.value.date.toISOString()).toBe("2026-12-25T05:00:00.000Z");
    const december = await t.ledger.getMonthSummary({ year: 2026, month: 12 });
    expect(december.ok && december.value.expenseSatang).toBe(100);
  });
});

describe("validation at the Ledger boundary", () => {
  beforeEach(async () => {
    t = await createTestLedger({ now: LATE_ON_LAST_DAY });
    await t.ledger.seedDefaultCategories();
  });
  afterEach(() => t.cleanup());

  it("rejects an expense recorded in an income Category", async () => {
    const salary = await incomeCategoryId();
    const result = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "100", categoryId: salary, day: "2026-10-10" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("CATEGORY_TYPE_MISMATCH");

    const summary = await t.ledger.getMonthSummary({ year: 2026, month: 10 });
    expect(summary.ok && summary.value.expenseSatang).toBe(0);
  });

  it("rejects an unknown Category with a Thai message", async () => {
    const result = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "100", categoryId: "nope", day: "2026-10-10" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("CATEGORY_NOT_FOUND");
      expect(result.error.message).toMatch(/[ก-๙]/);
    }
  });

  it("rejects an invalid amount, day, or oversized note before touching the database", async () => {
    const food = await expenseCategoryId();
    const badAmount = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "0", categoryId: food, day: "2026-10-10" });
    const badDay = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "5", categoryId: food, day: "31/10/2026" });
    const impossibleDay = await t.ledger.recordTransaction({ type: "EXPENSE", amount: "5", categoryId: food, day: "2026-02-30" });
    expect([badAmount.ok, badDay.ok, impossibleDay.ok]).toEqual([false, false, false]);
    if (!badAmount.ok) expect(badAmount.error.code).toBe("VALIDATION");
  });

  it("lists only active Categories of the requested type", async () => {
    const expense = await t.ledger.listActiveCategories("EXPENSE");
    const income = await t.ledger.listActiveCategories("INCOME");
    expect(expense).toHaveLength(8);
    expect(income).toHaveLength(4);
  });
});

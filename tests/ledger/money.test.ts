import { describe, expect, it } from "vitest";
import { createTestLedger } from "../helpers/db";

/**
 * Baht text to satang is exercised through the Ledger's public interface:
 * the amount a user types is accepted or rejected, and the stored satang show up in the summary.
 */
async function record(amount: string) {
  const t = await createTestLedger({ now: new Date("2026-10-15T05:00:00Z") });
  try {
    await t.ledger.seedDefaultCategories();
    const [cat] = await t.ledger.listActiveCategories("EXPENSE");
    const result = await t.ledger.recordTransaction({ type: "EXPENSE", amount, categoryId: cat.id, day: "2026-10-15" });
    const summary = await t.ledger.getMonthSummary({ year: 2026, month: 10 });
    return { result, expenseSatang: summary.ok ? summary.value.expenseSatang : NaN };
  } finally {
    await t.cleanup();
  }
}

describe("baht text to satang", () => {
  it.each([
    ["100", 10_000],
    ["100.5", 10_050],
    ["100.50", 10_050],
    ["0.01", 1],
    ["1,234.56", 123_456],
    ["  25 ", 2_500],
    ["99999999.99", 9_999_999_999],
  ])("accepts %s as %i satang", async (text, satang) => {
    const { result, expenseSatang } = await record(text);
    expect(result.ok).toBe(true);
    expect(expenseSatang).toBe(satang);
  });

  it.each([
    ["0", "zero"],
    ["0.00", "zero"],
    ["-5", "negative"],
    ["10.001", "more than two decimals"],
    ["100000000", "above the ceiling"],
    ["99999999.995", "above the ceiling with extra decimals"],
    ["", "empty"],
    ["abc", "not a number"],
    ["1e3", "scientific notation"],
    ["12.", "dangling point"],
  ])("rejects %j (%s)", async (text) => {
    const { result, expenseSatang } = await record(text);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
      expect(result.error.message).toMatch(/[ก-๙]/);
    }
    expect(expenseSatang).toBe(0);
  });
});

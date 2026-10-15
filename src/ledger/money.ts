import { fail, ok, type Result } from "./result";

export const MAX_SATANG = 9_999_999_999; // 99,999,999.99 baht

/** Parses baht text ("1,234.50") into integer satang. Rejects <= 0, > 2 decimals, > ceiling. */
export function parseBahtToSatang(text: string): Result<number> {
  const cleaned = text.trim().replace(/,/g, "");
  if (cleaned === "") return fail("VALIDATION", "กรุณาระบุจำนวนเงิน");

  const match = /^(-)?(\d+)(?:\.(\d*))?$/.exec(cleaned);
  if (!match || match[3] === "") return fail("VALIDATION", "จำนวนเงินไม่ถูกต้อง");

  const [, sign, whole, fraction = ""] = match;
  if (fraction.length > 2) return fail("VALIDATION", "จำนวนเงินต้องมีทศนิยมไม่เกิน 2 ตำแหน่ง");
  if (sign) return fail("VALIDATION", "จำนวนเงินต้องมากกว่า 0");

  // Digit-string arithmetic: no floating point anywhere.
  const wholeDigits = whole.replace(/^0+(?=\d)/, "");
  if (wholeDigits.length > 9) return fail("VALIDATION", "จำนวนเงินต้องไม่เกิน 99,999,999.99 บาท");
  const satang = Number(wholeDigits) * 100 + Number(fraction.padEnd(2, "0"));

  if (satang <= 0) return fail("VALIDATION", "จำนวนเงินต้องมากกว่า 0");
  if (satang > MAX_SATANG) return fail("VALIDATION", "จำนวนเงินต้องไม่เกิน 99,999,999.99 บาท");
  return ok(satang);
}

const thb = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });

/** Formats satang as Thai Baht, e.g. 12345 -> "฿123.45". */
export function formatSatangAsThb(satang: number): string {
  return thb.format(satang / 100);
}

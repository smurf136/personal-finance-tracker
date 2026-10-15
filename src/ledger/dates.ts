// Asia/Bangkok is a fixed UTC+7 with no daylight saving, so offset arithmetic is exact.
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True for a real calendar day in `YYYY-MM-DD` form (rejects 2026-02-30). */
export function isValidDay(day: string): boolean {
  const m = DAY_RE.exec(day);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const probe = new Date(Date.UTC(y, mo - 1, d));
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === mo - 1 && probe.getUTCDate() === d;
}

/** The Bangkok calendar day (`YYYY-MM-DD`) of an instant. */
export function bangkokDay(instant: Date): string {
  return new Date(instant.getTime() + BANGKOK_OFFSET_MS).toISOString().slice(0, 10);
}

/** UTC instant of Bangkok midnight at the start of `day`. */
export function bangkokMidnight(day: string): Date {
  const [y, mo, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d) - BANGKOK_OFFSET_MS);
}

/** ADR-0001: today in Bangkok keeps the current time, any other day gets 12:00 Bangkok. */
export function fillTransactionDate(day: string, now: Date): Date {
  if (bangkokDay(now) === day) return new Date(now.getTime());
  return new Date(bangkokMidnight(day).getTime() + 12 * 60 * 60 * 1000);
}

/** Half-open UTC range [start, end) covering one Bangkok Month. `month` is 1..12. */
export function monthRange(year: number, month: number): { start: Date; end: Date } {
  const pad = (n: number) => String(n).padStart(2, "0");
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  return {
    start: bangkokMidnight(`${year}-${pad(month)}-01`),
    end: bangkokMidnight(`${nextYear}-${pad(nextMonth)}-01`),
  };
}

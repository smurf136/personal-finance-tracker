export type ErrorCode =
  | "VALIDATION"
  | "CATEGORY_NOT_FOUND"
  | "CATEGORY_TYPE_MISMATCH"
  | "CATEGORY_ARCHIVED"
  | "INTERNAL";

export interface LedgerError {
  code: ErrorCode;
  /** Thai, safe to show to the user. Never contains amounts or notes. */
  message: string;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: LedgerError };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const fail = (code: ErrorCode, message: string): Result<never> => ({
  ok: false,
  error: { code, message },
});

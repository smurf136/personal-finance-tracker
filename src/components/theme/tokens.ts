export type ResolvedTheme = "light" | "dark";
export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "pft.theme";

/** Shared semantic colours: income green, expense red. Reuse in every screen. */
export const semanticColors = {
  light: { income: "#389e0d", expense: "#cf1322" },
  dark: { income: "#73d13d", expense: "#ff7875" },
} as const;

export const pageBackground = { light: "#f5f6f8", dark: "#101114" } as const;

export const radius = { card: 12, control: 8 } as const;

export function isThemeMode(v: unknown): v is ThemeMode {
  return v === "light" || v === "dark" || v === "system";
}

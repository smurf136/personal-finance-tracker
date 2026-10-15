"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import thTH from "antd/locale/th_TH";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  isThemeMode,
  pageBackground,
  radius,
  semanticColors,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeMode,
} from "./tokens";

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function readMode(): ThemeMode {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(v) ? v : "system";
  } catch {
    return "system";
  }
}

function subscribeMode(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const DARK_QUERY = "(prefers-color-scheme: dark)";
function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

type ThemeContextValue = { mode: ThemeMode; resolved: ResolvedTheme; setMode: (m: ThemeMode) => void };
const ThemeContext = createContext<ThemeContextValue>({ mode: "system", resolved: "light", setMode: () => {} });

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribeMode, readMode, () => "system" as ThemeMode);
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
  const resolved: ResolvedTheme = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  const setMode = useCallback((m: ThemeMode) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, m);
    } catch {
      // storage unavailable: choice lasts only for this page view
    }
    emit();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    root.style.setProperty("--pft-bg", pageBackground[resolved]);
    root.style.setProperty("--pft-income", semanticColors[resolved].income);
    root.style.setProperty("--pft-expense", semanticColors[resolved].expense);
  }, [resolved]);

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        locale={thTH}
        theme={{
          algorithm: resolved === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            borderRadius: radius.control,
            borderRadiusLG: radius.card,
            colorBgLayout: pageBackground[resolved],
            boxShadow: "none",
            boxShadowSecondary: "0 1px 2px rgba(0,0,0,0.06)",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

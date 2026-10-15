"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ThemeProvider>
        <App>
          <AppShell>{children}</AppShell>
        </App>
      </ThemeProvider>
    </AntdRegistry>
  );
}

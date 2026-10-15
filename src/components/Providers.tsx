"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import thTH from "antd/locale/th_TH";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider locale={thTH}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}

"use client";

import { Radio, Typography } from "antd";
import { useThemeMode } from "./ThemeProvider";
import { isThemeMode } from "./tokens";

export function ThemeSelector() {
  const { mode, setMode } = useThemeMode();
  return (
    <div>
      <Typography.Paragraph type="secondary">เลือกธีมของแอป โหมดตามระบบจะใช้การตั้งค่าของอุปกรณ์</Typography.Paragraph>
      <Radio.Group
        aria-label="ธีม"
        value={mode}
        optionType="button"
        buttonStyle="solid"
        onChange={(e) => isThemeMode(e.target.value) && setMode(e.target.value)}
        options={[
          { value: "light", label: "สว่าง" },
          { value: "dark", label: "มืด" },
          { value: "system", label: "ตามระบบ" },
        ]}
      />
    </div>
  );
}

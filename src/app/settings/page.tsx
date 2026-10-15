"use client";

import { Card, Flex, Typography } from "antd";
import { ThemeSelector } from "@/components/theme/ThemeSelector";

export default function SettingsPage() {
  return (
    <>
      <Typography.Title level={3}>ตั้งค่า</Typography.Title>
      <Flex vertical gap={16}>
        {/* Each later ticket (CSV, Backup) adds its own Card section here. */}
        <Card title="ธีม" id="theme">
          <ThemeSelector />
        </Card>
      </Flex>
    </>
  );
}

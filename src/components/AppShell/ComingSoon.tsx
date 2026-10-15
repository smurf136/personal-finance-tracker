"use client";

import { Card, Empty, Typography } from "antd";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <>
      <Typography.Title level={3}>{title}</Typography.Title>
      <Card>
        <Empty description={description} />
      </Card>
    </>
  );
}

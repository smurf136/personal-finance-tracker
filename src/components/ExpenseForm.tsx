"use client";

import { App, Button, Form, Input, Select } from "antd";
import { useState } from "react";
import { recordExpenseAction } from "@/app/actions/transactions";

interface Props {
  categories: { id: string; name: string }[];
  defaultDay: string;
}

interface Values {
  amount: string;
  categoryId: string;
  day: string;
  note?: string;
}

export function ExpenseForm({ categories, defaultDay }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<Values>();
  const [saving, setSaving] = useState(false);

  async function onFinish(values: Values) {
    setSaving(true);
    try {
      const result = await recordExpenseAction(values);
      if (result.ok) {
        message.success(result.message);
        form.setFieldsValue({ amount: "", note: "" });
      } else {
        message.error(result.message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form<Values>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ day: defaultDay, categoryId: categories[0]?.id }}
    >
      <Form.Item name="amount" label="จำนวนเงิน (บาท)" rules={[{ required: true, message: "กรุณาระบุจำนวนเงิน" }]}>
        <Input size="large" inputMode="decimal" placeholder="0.00" suffix="฿" />
      </Form.Item>
      <Form.Item name="categoryId" label="หมวดหมู่" rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}>
        <Select
          size="large"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          notFoundContent="ยังไม่มีหมวดหมู่ (รัน npm run db:seed)"
        />
      </Form.Item>
      <Form.Item name="day" label="วันที่" rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}>
        <Input size="large" type="date" />
      </Form.Item>
      <Form.Item name="note" label="หมายเหตุ">
        <Input size="large" maxLength={500} />
      </Form.Item>
      <Button type="primary" htmlType="submit" size="large" block loading={saving}>
        บันทึกรายจ่าย
      </Button>
    </Form>
  );
}

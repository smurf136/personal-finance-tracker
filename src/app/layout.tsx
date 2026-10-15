import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "บันทึกรายรับรายจ่าย",
  description: "ติดตามรายรับและรายจ่ายส่วนตัวรายเดือน",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body style={{ margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

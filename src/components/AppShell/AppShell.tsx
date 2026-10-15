"use client";

import { AppstoreOutlined, OrderedListOutlined, SettingOutlined, TagsOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import "./appShell.css";

const NAV_ITEMS = [
  { href: "/", label: "ภาพรวม", icon: <AppstoreOutlined aria-hidden /> },
  { href: "/transactions", label: "รายการ", icon: <OrderedListOutlined aria-hidden /> },
  { href: "/categories", label: "หมวดหมู่", icon: <TagsOutlined aria-hidden /> },
  { href: "/settings", label: "ตั้งค่า", icon: <SettingOutlined aria-hidden /> },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { token } = theme.useToken();
  const activeHref = NAV_ITEMS.find((i) => isActive(pathname, i.href))?.href;

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }} hasSider>
      <div className="pft-sider">
        <Layout.Sider
          width={220}
          theme="light"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgContainer,
          }}
        >
          <nav aria-label="เมนูหลัก">
            <div style={{ padding: "20px 24px 12px", fontWeight: 600 }}>บันทึกรายรับรายจ่าย</div>
            <Menu
              mode="inline"
              selectedKeys={activeHref ? [activeHref] : []}
              style={{ borderInlineEnd: "none", background: "transparent" }}
              items={NAV_ITEMS.map((i) => ({
                key: i.href,
                icon: i.icon,
                label: (
                  <Link href={i.href} aria-current={i.href === activeHref ? "page" : undefined}>
                    {i.label}
                  </Link>
                ),
              }))}
            />
          </nav>
        </Layout.Sider>
      </div>

      <Layout style={{ background: "transparent", minWidth: 0 }}>
        <Layout.Content className="pft-main">
          <div className="pft-content">{children}</div>
        </Layout.Content>
      </Layout>

      <nav
        aria-label="เมนูหลัก"
        className="pft-bottom-nav"
        style={{ background: token.colorBgContainer, "--pft-nav-border": token.colorBorderSecondary } as CSSProperties}
      >
        {NAV_ITEMS.map((i) => {
          const active = i.href === activeHref;
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={active ? "page" : undefined}
              style={{ color: active ? token.colorPrimary : token.colorTextSecondary, fontWeight: active ? 600 : 400 }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{i.icon}</span>
              <span>{i.label}</span>
            </Link>
          );
        })}
      </nav>
    </Layout>
  );
}

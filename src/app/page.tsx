import { Alert, Card, Col, Row, Statistic, Typography } from "antd";
import { ExpenseForm } from "@/components/ExpenseForm";
import { bangkokDay, createLedger, formatSatangAsThb } from "@/ledger";

// Always read the live database; never prerender at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const ledger = createLedger();
  const today = bangkokDay(new Date());
  const [year, month] = today.split("-").map(Number);

  const summary = await ledger.getMonthSummary({ year, month });
  const categories = await ledger.listActiveCategories("EXPENSE");

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <Typography.Title level={3}>บันทึกรายรับรายจ่าย</Typography.Title>

      {summary.ok ? (
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="รายรับเดือนนี้"
                value={formatSatangAsThb(summary.value.incomeSatang)}
                styles={{ content: { color: "#389e0d" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="รายจ่ายเดือนนี้"
                value={formatSatangAsThb(summary.value.expenseSatang)}
                styles={{ content: { color: "#cf1322" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="คงเหลือสุทธิเดือนนี้" value={formatSatangAsThb(summary.value.netSatang)} />
            </Card>
          </Col>
        </Row>
      ) : (
        <Alert type="error" showIcon message={summary.error.message} style={{ marginBottom: 16 }} />
      )}

      <Card title="เพิ่มรายจ่าย">
        <ExpenseForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} defaultDay={today} />
      </Card>
    </main>
  );
}

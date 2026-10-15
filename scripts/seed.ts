import { createLedger } from "../src/ledger";
import { getPrisma } from "../src/server/db";

async function main() {
  const { seeded } = await createLedger().seedDefaultCategories();
  console.log(seeded ? "Seeded default categories." : "Categories already exist; nothing to do.");
  await getPrisma().$disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : "unknown error");
  process.exit(1);
});

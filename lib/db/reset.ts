import { drizzle } from "drizzle-orm/postgres-js";
import { seed } from "drizzle-seed";
import { user } from "./schema";
import { config } from "dotenv";
import * as schema from "./schema";
import { reset } from "drizzle-seed";
import { faker } from "@faker-js/faker";

config({ path: ".env.local" }); // or .env.local

async function main() {
  const db = drizzle(process.env.POSTGRES_URL!);
  const start = Date.now();

  console.log("⏳ Resetting Database...");
  await reset(db, schema);
  console.log("✅ Successfully reset database");

  const end = Date.now();

  console.log("✅ reset completed in", end - start, "ms");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ reset failed");
  console.error(err);
  process.exit(1);
});

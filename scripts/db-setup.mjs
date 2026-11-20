// Vercel'da production build paytida: bazadagi jadvallarni yangilaydi va bo'sh bo'lsa boshlang'ich darslarni yozadi.
import { execSync } from "node:child_process";

if (process.env.VERCEL_ENV !== "production") {
  console.log("db-setup: production emas — o'tkazib yuborildi");
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.error("db-setup: DATABASE_URL topilmadi");
  process.exit(1);
}
execSync("npx prisma migrate deploy", { stdio: "inherit" });
execSync("node prisma/seed.mjs", { stdio: "inherit" });

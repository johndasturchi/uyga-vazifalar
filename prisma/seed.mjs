// Boshlang'ich ma'lumotlar: 4 oy, 48 dars va resurslar. Faqat baza bo'sh bo'lsa yoziladi.
import { PrismaClient } from "@prisma/client";
import { lessons, resources } from "./seed-data.js";

const prisma = new PrismaClient();

const MONTHS = [
  { order: 1, name: "1-oy", desc: "HTML va CSS asoslari" },
  { order: 2, name: "2-oy", desc: "Joylashuv va effektlar" },
  { order: 3, name: "3-oy", desc: "Dizayn vositalari va FlexBox" },
  { order: 4, name: "4-oy", desc: "SASS, Responsive, Bootstrap" },
];

async function main() {
  if ((await prisma.month.count()) > 0) {
    console.log("Baza bo'sh emas — seed o'tkazib yuborildi.");
    return;
  }
  const monthIds = {};
  for (const m of MONTHS) {
    const row = await prisma.month.create({ data: m });
    monthIds[m.order] = row.id;
  }
  for (const l of lessons) {
    const items = [];
    for (const t of l.tasks) {
      t.items.forEach((it, i) =>
        items.push({
          level: t.level,
          order: i,
          type: it.type,
          src: it.src ?? null,
          view: it.view ?? null,
          poster: it.poster ?? null,
          url: it.url ?? null,
          w: it.w ?? null,
          h: it.h ?? null,
        })
      );
    }
    await prisma.lesson.create({
      data: { number: l.id, title: l.title, monthId: monthIds[l.month], items: { create: items } },
    });
  }
  let order = 0;
  for (const r of resources.images)
    await prisma.resource.create({ data: { kind: "image", order: order++, src: r.src, view: r.view, thumb: r.thumb } });
  order = 0;
  for (const r of resources.videos)
    await prisma.resource.create({ data: { kind: "video", order: order++, src: r.src, poster: r.poster } });
  order = 0;
  for (const src of resources.musics) await prisma.resource.create({ data: { kind: "music", order: order++, src } });
  console.log("Seed tayyor:", lessons.length, "dars.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

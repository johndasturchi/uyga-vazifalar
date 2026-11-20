// Ommaviy: saytdagi barcha oylar, darslar va resurslar (CDN keshlanadi)
import { prisma } from "./_lib/db.js";
import { shapeLesson, shapeResources } from "./_lib/shape.js";
import { sendError } from "./_lib/http.js";
import { addCacheTag } from "@vercel/functions";
import { DATA_TAG } from "./_lib/cache.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Faqat GET" });
  try {
    const [months, lessons, resources] = await Promise.all([
      prisma.month.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
      prisma.lesson.findMany({ orderBy: { number: "asc" }, include: { items: true } }),
      prisma.resource.findMany(),
    ]);
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.setHeader("CDN-Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
    res.setHeader("Vercel-Cache-Tag", DATA_TAG);
    try {
      await addCacheTag(DATA_TAG);
    } catch {
      /* kesh tegi ixtiyoriy */
    }
    res.status(200).json({
      months: months.map((m) => ({ id: m.id, name: m.name, desc: m.desc, order: m.order })),
      lessons: lessons.map(shapeLesson),
      resources: shapeResources(resources),
    });
  } catch (e) {
    sendError(res, e);
  }
}

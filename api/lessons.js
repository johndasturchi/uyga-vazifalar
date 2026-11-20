import { prisma } from "./_lib/db.js";
import { adminHandler, body, idParam, HttpError } from "./_lib/http.js";
import { deleteBlobs, itemUrls } from "./_lib/blobs.js";
import { shapeLesson } from "./_lib/shape.js";

const LEVELS = ["sodda", "orta", "murakkab"];
const TYPES = ["image", "video", "link"];

const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
const int = (v) => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Math.round(Number(v)) : null);

async function parse(req) {
  const b = body(req);
  const number = int(b.number);
  const title = str(b.title);
  const monthId = int(b.monthId);
  if (!number || number < 1) throw new HttpError(400, "Dars raqamini kiriting");
  if (!title) throw new HttpError(400, "Dars nomini kiriting");
  if (!monthId || !(await prisma.month.findUnique({ where: { id: monthId } })))
    throw new HttpError(400, "Oyni tanlang");
  if (!Array.isArray(b.tasks)) throw new HttpError(400, "Topshiriqlar noto'g'ri");

  const items = [];
  for (const task of b.tasks) {
    if (!LEVELS.includes(task.level)) throw new HttpError(400, "Topshiriq darajasi noto'g'ri");
    (task.items || []).forEach((it, order) => {
      if (!TYPES.includes(it.type)) throw new HttpError(400, "Topshiriq turi noto'g'ri");
      if (it.type === "link") {
        const url = str(it.url);
        if (!url || !/^https?:\/\//i.test(url)) throw new HttpError(400, "Havola http:// yoki https:// bilan boshlanishi kerak");
        items.push({ level: task.level, order, type: "link", url });
      } else {
        const src = str(it.src);
        if (!src) throw new HttpError(400, "Fayl yuklanmagan topshiriq bor");
        items.push({
          level: task.level,
          order,
          type: it.type,
          src,
          view: str(it.view),
          poster: str(it.poster),
          w: int(it.w),
          h: int(it.h),
        });
      }
    });
  }
  return { number, title, monthId, items };
}

export default adminHandler({
  async GET() {
    const lessons = await prisma.lesson.findMany({ orderBy: { number: "asc" }, include: { items: true } });
    return lessons.map(shapeLesson);
  },

  async POST(req) {
    const { items, ...data } = await parse(req);
    const lesson = await prisma.lesson.create({ data: { ...data, items: { create: items } }, include: { items: true } });
    return shapeLesson(lesson);
  },

  async PUT(req) {
    const id = idParam(req);
    const { items, ...data } = await parse(req);
    const old = await prisma.lesson.findUnique({ where: { id }, include: { items: true } });
    if (!old) throw new HttpError(404, "Dars topilmadi");
    const lesson = await prisma.$transaction(async (tx) => {
      await tx.item.deleteMany({ where: { lessonId: id } });
      return tx.lesson.update({ where: { id }, data: { ...data, items: { create: items } }, include: { items: true } });
    });
    const keep = new Set(items.flatMap(itemUrls));
    await deleteBlobs(old.items.flatMap(itemUrls).filter((u) => u && !keep.has(u)));
    return shapeLesson(lesson);
  },

  async DELETE(req) {
    const id = idParam(req);
    const old = await prisma.lesson.delete({ where: { id }, include: { items: true } });
    await deleteBlobs(old.items.flatMap(itemUrls));
    return { ok: true };
  },
});

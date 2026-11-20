import { prisma } from "./_lib/db.js";
import { adminHandler, body, idParam, HttpError } from "./_lib/http.js";

function parse(req) {
  const b = body(req);
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const desc = typeof b.desc === "string" ? b.desc.trim() : "";
  const order = Math.round(Number(b.order));
  if (!name) throw new HttpError(400, "Oy nomini kiriting");
  if (!Number.isFinite(order)) throw new HttpError(400, "Tartib raqamini kiriting");
  return { name, desc, order };
}

export default adminHandler({
  async GET() {
    const months = await prisma.month.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { lessons: true } } },
    });
    return months.map((m) => ({ id: m.id, name: m.name, desc: m.desc, order: m.order, lessons: m._count.lessons }));
  },
  async POST(req) {
    return prisma.month.create({ data: parse(req) });
  },
  async PUT(req) {
    return prisma.month.update({ where: { id: idParam(req) }, data: parse(req) });
  },
  async DELETE(req) {
    const id = idParam(req);
    const count = await prisma.lesson.count({ where: { monthId: id } });
    if (count) throw new HttpError(409, `Bu oyda ${count} ta dars bor. Avval darslarni boshqa oyga o'tkazing yoki o'chiring.`);
    await prisma.month.delete({ where: { id } });
    return { ok: true };
  },
});

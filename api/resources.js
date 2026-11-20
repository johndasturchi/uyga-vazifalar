import { prisma } from "./_lib/db.js";
import { adminHandler, body, idParam, HttpError } from "./_lib/http.js";
import { deleteBlobs, itemUrls } from "./_lib/blobs.js";
import { shapeResources } from "./_lib/shape.js";

const KINDS = ["image", "video", "music"];
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

export default adminHandler({
  async GET() {
    return shapeResources(await prisma.resource.findMany());
  },
  async POST(req) {
    const b = body(req);
    if (!KINDS.includes(b.kind)) throw new HttpError(400, "Resurs turi noto'g'ri");
    const src = str(b.src);
    if (!src) throw new HttpError(400, "Fayl yuklanmagan");
    const last = await prisma.resource.findFirst({ where: { kind: b.kind }, orderBy: { order: "desc" } });
    return prisma.resource.create({
      data: {
        kind: b.kind,
        title: str(b.title) || "",
        src,
        view: str(b.view),
        thumb: str(b.thumb),
        poster: str(b.poster),
        order: (last?.order ?? -1) + 1,
      },
    });
  },
  async PUT(req) {
    const id = idParam(req);
    const b = body(req);
    const data = {};
    if (typeof b.title === "string") data.title = b.title.trim();
    if (Number.isFinite(Number(b.order))) data.order = Math.round(Number(b.order));
    return prisma.resource.update({ where: { id }, data });
  },
  async DELETE(req) {
    const old = await prisma.resource.delete({ where: { id: idParam(req) } });
    await deleteBlobs(itemUrls(old));
    return { ok: true };
  },
});

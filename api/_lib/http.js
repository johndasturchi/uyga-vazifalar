import { isAdmin } from "./auth.js";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body) {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new HttpError(400, "Noto'g'ri so'rov");
    }
  }
  return {};
}

export function idParam(req) {
  const id = Number(req.query?.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "ID noto'g'ri");
  return id;
}

/**
 * Admin uchun API handler: avtorizatsiya, metodlar va xatolarni boshqaradi.
 * routes = { GET: fn, POST: fn, ... }
 */
export function adminHandler(routes) {
  return async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      if (!isAdmin(req)) throw new HttpError(401, "Avval tizimga kiring");
      const fn = routes[req.method];
      if (!fn) throw new HttpError(405, "Bu amal qo'llab-quvvatlanmaydi");
      const result = await fn(req, res);
      if (!res.headersSent) res.status(200).json(result ?? { ok: true });
    } catch (e) {
      sendError(res, e);
    }
  };
}

export function sendError(res, e) {
  if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
  if (e?.code === "P2002") return res.status(409).json({ error: "Bu raqamli dars allaqachon mavjud" });
  if (e?.code === "P2025") return res.status(404).json({ error: "Ma'lumot topilmadi" });
  console.error(e);
  return res.status(500).json({ error: "Serverda xatolik yuz berdi" });
}

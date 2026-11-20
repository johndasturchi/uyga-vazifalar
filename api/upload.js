// Admin brauzerdan to'g'ridan-to'g'ri Vercel Blob'ga fayl yuklashi uchun ruxsat (token) beradi
import { handleUpload } from "@vercel/blob/client";
import { verifyToken } from "./_lib/auth.js";
import { body, sendError } from "./_lib/http.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Faqat POST" });
  try {
    const result = await handleUpload({
      body: body(req),
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let token = null;
        try {
          token = JSON.parse(clientPayload || "{}").token;
        } catch {
          /* bo'sh */
        }
        if (!verifyToken(token)) throw new Error("Avval tizimga kiring");
        return {
          allowedContentTypes: ["image/*", "video/*", "audio/*"],
          maximumSizeInBytes: 200 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
    });
    res.status(200).json(result);
  } catch (e) {
    if (e?.message === "Avval tizimga kiring") return res.status(401).json({ error: e.message });
    sendError(res, e);
  }
}

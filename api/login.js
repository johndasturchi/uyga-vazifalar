import { checkPassword, createToken, isAdmin } from "./_lib/auth.js";
import { body, sendError } from "./_lib/http.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") return res.status(200).json({ ok: isAdmin(req) });
    if (req.method !== "POST") return res.status(405).json({ error: "Faqat POST" });
    const { password } = body(req);
    if (!checkPassword(password)) {
      await new Promise((r) => setTimeout(r, 700));
      return res.status(401).json({ error: "Parol noto'g'ri" });
    }
    res.status(200).json({ token: createToken() });
  } catch (e) {
    sendError(res, e);
  }
}

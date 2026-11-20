import { dangerouslyDeleteByTag } from "@vercel/functions";

export const DATA_TAG = "site-data";

/** Admin o'zgartirish kiritganda saytdagi keshni darhol tozalaydi. */
export async function purgeSiteData() {
  try {
    await dangerouslyDeleteByTag(DATA_TAG);
  } catch (e) {
    console.error("Keshni tozalashda xato:", e);
  }
}

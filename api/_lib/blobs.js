import { del } from "@vercel/blob";

const isBlob = (u) => typeof u === "string" && u.includes(".blob.vercel-storage.com");

/** Faqat Vercel Blob'dagi fayllarni o'chiradi (public/files dagi eski fayllarga tegmaydi). */
export async function deleteBlobs(urls) {
  const list = [...new Set(urls.filter(isBlob))];
  if (!list.length) return;
  try {
    await del(list);
  } catch (e) {
    console.error("Blob o'chirishda xato:", e);
  }
}

export function itemUrls(item) {
  return [item.src, item.view, item.poster, item.thumb];
}

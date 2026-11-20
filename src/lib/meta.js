export const LEVELS = {
  sodda: {
    name: "Sodda topshiriq",
    short: "Sodda",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  orta: {
    name: "O'rta darajadagi topshiriq",
    short: "O'rta",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  murakkab: {
    name: "Murakkab topshiriq",
    short: "Murakkab",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
  },
};

export const LEVEL_KEYS = ["sodda", "orta", "murakkab"];

export function fileName(src) {
  return decodeURIComponent(src.split("?")[0].split("/").pop());
}

// Vercel Blob fayllari boshqa domenda turadi, shuning uchun majburiy yuklab olish uchun ?download=1 qo'shiladi
export function downloadUrl(src) {
  return src.includes(".blob.vercel-storage.com") ? `${src}${src.includes("?") ? "&" : "?"}download=1` : src;
}

// Keyingi darsning rasmlarini oldindan (fonda) yuklab qo'yish
const prefetched = new Set();
export function prefetchLesson(lesson) {
  if (!lesson) return;
  lesson.tasks.forEach((t) =>
    t.items.forEach((it) => {
      const url = it.type === "image" ? it.view || it.src : it.poster;
      if (!url || prefetched.has(url)) return;
      prefetched.add(url);
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    })
  );
}

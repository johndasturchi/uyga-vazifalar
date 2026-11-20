export const MONTHS = [
  { id: 1, name: "1-oy", desc: "HTML va CSS asoslari" },
  { id: 2, name: "2-oy", desc: "Joylashuv va effektlar" },
  { id: 3, name: "3-oy", desc: "Dizayn vositalari va FlexBox" },
  { id: 4, name: "4-oy", desc: "SASS, Responsive, Bootstrap" },
];

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

export function fileName(src) {
  return src.split("/").pop();
}

// Keyingi darsning rasmlarini oldindan (fonda) yuklab qo'yish
const prefetched = new Set();
export function prefetchLesson(lesson) {
  if (!lesson) return;
  lesson.tasks.forEach((t) =>
    t.items.forEach((it) => {
      const url = it.view || it.poster;
      if (!url || prefetched.has(url)) return;
      prefetched.add(url);
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    })
  );
}

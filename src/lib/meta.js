import { useEffect, useState, useCallback } from "react";

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

const KEY = "uyga-vazifalar:done";

function readDone() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function useProgress() {
  const [done, setDone] = useState(readDone);

  useEffect(() => {
    const sync = (e) => {
      if (e.key === KEY) setDone(readDone());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggle = useCallback((id) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* xotira mavjud emas */
      }
      return next;
    });
  }, []);

  return { done, toggle, isDone: (id) => done.includes(id) };
}

export function fileName(src) {
  return src.split("/").pop();
}

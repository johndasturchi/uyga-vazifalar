import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, SearchX } from "lucide-react";
import { lessons } from "../data/lessons.js";
import { MONTHS, useProgress } from "../lib/meta.js";
import LessonCard from "../components/LessonCard.jsx";

const STATUS = [
  { id: "all", name: "Barchasi" },
  { id: "todo", name: "Bajarilmagan" },
  { id: "done", name: "Bajarilgan" },
];

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const month = Number(params.get("oy")) || 0;
  const status = params.get("holat") || "all";
  const { done, isDone } = useProgress();

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || value === 0) next.delete(key);
    else next.set(key, String(value));
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return lessons.filter((l) => {
      if (month && l.month !== month) return false;
      if (status === "done" && !isDone(l.id)) return false;
      if (status === "todo" && isDone(l.id)) return false;
      if (!text) return true;
      return (
        l.title.toLowerCase().includes(text) ||
        `${l.id}-dars`.includes(text) ||
        String(l.id) === text
      );
    });
  }, [q, month, status, done]); // eslint-disable-line react-hooks/exhaustive-deps

  const percent = Math.round((done.length / lessons.length) * 100);
  const hasFilters = q || month || status !== "all";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Sarlavha va progress */}
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Uyga vazifalar</h1>
          <p className="mt-2 max-w-xl text-slate-500">
            Har bir darsda sodda, o'rta va murakkab darajadagi topshiriqlar bor. Topshiriqni bajaring va
            o'qituvchingizga yuboring.
          </p>
        </div>
        <div className="w-full rounded-xl border border-slate-200 p-4 md:w-72">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-500">Bajarilgan darslar</span>
            <span className="text-sm font-semibold">
              {done.length} / {lessons.length}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      {/* Qidiruv va filtrlar */}
      <section className="mt-8 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Mavzu yoki dars raqami..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-base outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
          {q && (
            <button
              onClick={() => update("q", "")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tozalash"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <Chip active={!month} onClick={() => update("oy", 0)}>
              Barcha oylar
            </Chip>
            {MONTHS.map((m) => (
              <Chip key={m.id} active={month === m.id} onClick={() => update("oy", m.id)}>
                {m.name}
              </Chip>
            ))}
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {STATUS.map((s) => (
              <Chip key={s.id} active={status === s.id} onClick={() => update("holat", s.id)}>
                {s.name}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* Darslar */}
      <section className="mt-8 space-y-10">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <SearchX className="h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium">Hech narsa topilmadi</p>
            <p className="mt-1 text-sm text-slate-500">Boshqa so'z bilan qidirib ko'ring</p>
            {hasFilters && (
              <button
                onClick={() => setParams({}, { replace: true })}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Filtrlarni tozalash
              </button>
            )}
          </div>
        )}

        {MONTHS.map((m) => {
          const list = filtered.filter((l) => l.month === m.id);
          if (!list.length) return null;
          return (
            <div key={m.id}>
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-xl font-semibold">{m.name}</h2>
                <span className="text-sm text-slate-400">{m.desc}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((l) => (
                  <LessonCard key={l.id} lesson={l} done={isDone(l.id)} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

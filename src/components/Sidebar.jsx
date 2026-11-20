import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, FolderOpen, Home, Search, X } from "lucide-react";
import { lessons } from "../data/lessons.js";
import { MONTHS, prefetchLesson } from "../lib/meta.js";

function currentLessonId(pathname) {
  const m = pathname.match(/^\/dars\/(\d+)/);
  return m ? Number(m[1]) : null;
}

export default function Sidebar({ onNavigate }) {
  const { pathname } = useLocation();
  const activeId = currentLessonId(pathname);
  const activeMonth = lessons.find((l) => l.id === activeId)?.month;

  const [q, setQ] = useState("");
  const [month, setMonth] = useState(0);
  const [open, setOpen] = useState(() => new Set([activeMonth || 1]));
  const activeRef = useRef(null);

  // Faol dars oyini ochib qo'yish
  useEffect(() => {
    if (activeMonth) setOpen((prev) => (prev.has(activeMonth) ? prev : new Set(prev).add(activeMonth)));
  }, [activeMonth]);

  // Faol darsni ko'rinadigan joyga aylantirish
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const text = q.trim().toLowerCase();
  const filtering = Boolean(text) || Boolean(month);

  const groups = useMemo(
    () =>
      MONTHS.filter((m) => !month || m.id === month)
        .map((m) => ({
          ...m,
          items: lessons.filter(
            (l) =>
              l.month === m.id &&
              (!text || l.title.toLowerCase().includes(text) || String(l.id) === text || `${l.id}-dars`.includes(text))
          ),
        }))
        .filter((g) => g.items.length),
    [text, month]
  );

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const linkBase = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition";

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-5 pb-4">
        <Link to="/" onClick={onNavigate} className="inline-flex">
          <img src="/logo.png" alt="Meta IT School" width="120" height="36" className="h-9 w-auto" />
        </Link>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Darsni qidirish..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tozalash"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-[auto_repeat(4,minmax(0,1fr))] gap-1 rounded-lg bg-slate-100 p-1">
          {[{ id: 0, name: "Hammasi" }, ...MONTHS].map((m) => (
            <button
              key={m.id}
              onClick={() => setMonth(m.id)}
              className={`rounded-md px-2 py-1.5 text-xs font-medium transition ${
                month === m.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {m.id ? m.name : "Hammasi"}
            </button>
          ))}
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `${linkBase} mb-1 font-medium ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <Home className="h-4 w-4" />
          Bosh sahifa
        </NavLink>

        {groups.length === 0 && <p className="px-3 py-6 text-center text-sm text-slate-400">Hech narsa topilmadi</p>}

        {groups.map((g) => {
          const isOpen = filtering || open.has(g.id);
          return (
            <div key={g.id} className="mt-2">
              <button
                onClick={() => toggle(g.id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-50"
              >
                <span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-900">{g.name}</span>
                  <span className="ml-2 text-xs text-slate-400">{g.items.length} dars</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <ul className="mt-0.5 space-y-0.5 border-l border-slate-100 ml-4 pl-2">
                  {g.items.map((l) => {
                    const active = l.id === activeId;
                    return (
                      <li key={l.id}>
                        <Link
                          ref={active ? activeRef : undefined}
                          to={`/dars/${l.id}`}
                          onClick={onNavigate}
                          onMouseEnter={() => prefetchLesson(l)}
                          onFocus={() => prefetchLesson(l)}
                          className={`${linkBase} py-1.5 ${
                            active
                              ? "bg-blue-50 font-medium text-blue-700"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span
                            className={`w-6 shrink-0 text-xs tabular-nums ${active ? "text-blue-500" : "text-slate-400"}`}
                          >
                            {l.id}.
                          </span>
                          <span className="truncate">{l.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <NavLink
          to="/resurslar"
          onClick={onNavigate}
          className={({ isActive }) =>
            `${linkBase} font-medium ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <FolderOpen className="h-4 w-4" />
          Resurslar
        </NavLink>
      </div>
    </div>
  );
}

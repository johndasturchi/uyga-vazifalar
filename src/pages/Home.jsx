import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { lessons } from "../data/lessons.js";
import { LEVELS, MONTHS, prefetchLesson } from "../lib/meta.js";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Uyga vazifalar</h1>
      <p className="mt-3 max-w-2xl text-slate-500">
        Frontend kursining {lessons.length} ta darsi bo'yicha topshiriqlar. Chap tomondagi menyudan darsni tanlang,
        topshiriqni bajaring va o'qituvchingizga yuboring.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(LEVELS).map(([key, lv]) => (
          <span key={key} className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${lv.badge}`}>
            {lv.name}
          </span>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {MONTHS.map((m) => {
          const list = lessons.filter((l) => l.month === m.id);
          const first = list[0];
          return (
            <div key={m.id} className="flex flex-col rounded-2xl border border-slate-200 p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">{m.name}</h2>
                <span className="text-sm text-slate-400">{list.length} dars</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{m.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {list.map((l) => (
                  <li key={l.id}>
                    <Link
                      to={`/dars/${l.id}`}
                      onMouseEnter={() => prefetchLesson(l)}
                      title={`${l.id}-dars: ${l.title}`}
                      className="flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-50 px-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {l.id}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to={`/dars/${first.id}`}
                onMouseEnter={() => prefetchLesson(first)}
                className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {first.id}-darsdan boshlash
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

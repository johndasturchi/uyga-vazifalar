import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  Maximize2,
  Circle,
} from "lucide-react";
import { lessons } from "../data/lessons.js";
import { LEVELS, MONTHS, useProgress, fileName } from "../lib/meta.js";
import Lightbox from "../components/Lightbox.jsx";
import NotFound from "./NotFound.jsx";

function linkLabel(url) {
  return url.includes("figma.com") ? "Figmada ochish" : "Online ko'rish";
}

function TaskItem({ item, onZoom }) {
  if (item.type === "link") {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
      >
        <ExternalLink className="h-4 w-4" />
        {linkLabel(item.url)}
      </a>
    );
  }

  return (
    <div className="space-y-3">
      {item.type === "image" ? (
        <button
          onClick={() => onZoom(item.src)}
          className="group relative block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
        >
          <img src={item.src} alt="" loading="lazy" className="mx-auto w-full object-contain" />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
            Kattalashtirish
          </span>
        </button>
      ) : (
        <video controls preload="metadata" src={item.src} className="w-full rounded-xl border border-slate-200 bg-black" />
      )}
      <a
        href={item.src}
        download={fileName(item.src)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <Download className="h-4 w-4" />
        Topshiriqni yuklab olish
      </a>
    </div>
  );
}

export default function Lesson() {
  const { id } = useParams();
  const index = lessons.findIndex((l) => String(l.id) === id);
  const [zoom, setZoom] = useState(null);
  const { isDone, toggle } = useProgress();

  if (index === -1) return <NotFound />;

  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const month = MONTHS.find((m) => m.id === lesson.month);
  const done = isDone(lesson.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to={`/?oy=${lesson.month}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Darslar ro'yxati
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            {lesson.id}-dars · {month?.name}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {lesson.tasks.map((t) => (
              <a
                key={t.level}
                href={`#${t.level}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${LEVELS[t.level].badge}`}
              >
                {LEVELS[t.level].short}
              </a>
            ))}
          </div>
        </div>
        <button
          onClick={() => toggle(lesson.id)}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            done
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          {done ? "Bajarildi" : "Bajarildi deb belgilash"}
        </button>
      </header>

      <div className="mt-8 space-y-6">
        {lesson.tasks.map((task) => {
          const lv = LEVELS[task.level];
          return (
            <section
              key={task.level}
              id={task.level}
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200"
            >
              <div className={`h-1 ${lv.bar}`} />
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${lv.dot}`} />
                  <h2 className="text-lg font-semibold">{lv.name}</h2>
                </div>
                <div className="space-y-6">
                  {task.items.map((item, i) => (
                    <TaskItem key={i} item={item} onZoom={setZoom} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/dars/${prev.id}`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Oldingi · {prev.id}-dars</p>
              <p className="truncate font-medium">{prev.title}</p>
            </div>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link
            to={`/dars/${next.id}`}
            className="flex items-center justify-end gap-3 rounded-xl border border-slate-200 p-4 text-right hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Keyingi · {next.id}-dars</p>
              <p className="truncate font-medium">{next.title}</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
          </Link>
        )}
      </nav>

      <Lightbox src={zoom} onClose={() => setZoom(null)} />
    </div>
  );
}

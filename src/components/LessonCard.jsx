import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { LEVELS } from "../lib/meta.js";

export default function LessonCard({ lesson, done }) {
  return (
    <Link
      to={`/dars/${lesson.id}`}
      className={`group flex items-center gap-4 rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        done ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-base font-semibold ${
          done ? "bg-emerald-500 text-white" : "bg-blue-50 text-blue-700"
        }`}
      >
        {done ? <CheckCircle2 className="h-6 w-6" /> : lesson.id}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">{lesson.id}-dars</p>
        <h3 className="truncate font-semibold text-slate-900">{lesson.title}</h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          {lesson.tasks.map((t) => (
            <span
              key={t.level}
              title={LEVELS[t.level].name}
              className={`h-1.5 w-6 rounded-full ${LEVELS[t.level].dot}`}
            />
          ))}
          <span className="ml-1 text-xs text-slate-400">{lesson.tasks.length} ta topshiriq</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
    </Link>
  );
}

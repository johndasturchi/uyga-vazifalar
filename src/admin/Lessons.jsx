import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Search, Trash2, X, ExternalLink } from "lucide-react";
import { api } from "./api.js";
import { Button, ConfirmModal, Spinner, inputClass, useToast } from "./ui.jsx";
import { LEVELS, LEVEL_KEYS } from "../lib/meta.js";
import { useData } from "../lib/data.jsx";

export default function Lessons() {
  const toast = useToast();
  const { reload } = useData();
  const [lessons, setLessons] = useState(null);
  const [months, setMonths] = useState([]);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState(0);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const [l, m] = await Promise.all([api("lessons"), api("months")]);
      setLessons(l);
      setMonths(m);
    } catch (e) {
      toast(e.message, "error");
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const monthName = (id) => months.find((m) => m.id === id)?.name || "—";

  const filtered = useMemo(() => {
    if (!lessons) return [];
    const text = q.trim().toLowerCase();
    return lessons.filter(
      (l) =>
        (!month || l.month === month) &&
        (!text || l.title.toLowerCase().includes(text) || String(l.id) === text)
    );
  }, [lessons, q, month]);

  const remove = async () => {
    setDeleting(true);
    try {
      await api(`lessons?id=${toDelete.dbId}`, { method: "DELETE" });
      setLessons((list) => list.filter((l) => l.dbId !== toDelete.dbId));
      toast(`${toDelete.id}-dars o'chirildi`);
      setToDelete(null);
      reload();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Darslar</h1>
          <p className="mt-1 text-sm text-slate-500">{lessons ? `Jami ${lessons.length} ta dars` : "Yuklanmoqda..."}</p>
        </div>
        <Link to="/admin/darslar/yangi">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Yangi dars
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Dars nomi yoki raqami..."
            className={`${inputClass} pl-9 pr-9`}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100"
              aria-label="Tozalash"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
          {[{ id: 0, name: "Barcha oylar" }, ...months].map((m) => (
            <button
              key={m.id}
              onClick={() => setMonth(m.id)}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition ${
                month === m.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {!lessons ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          Hech qanday dars topilmadi
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="hidden bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500 md:table-header-group">
              <tr>
                <th className="w-16 px-4 py-3">№</th>
                <th className="px-4 py-3">Dars nomi</th>
                <th className="w-28 px-4 py-3">Oy</th>
                <th className="w-48 px-4 py-3">Topshiriqlar</th>
                <th className="w-36 px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.dbId} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 md:table-row md:p-0">
                  <td className="font-semibold text-slate-400 md:px-4 md:py-3">{l.id}</td>
                  <td className="min-w-0 flex-1 font-medium md:px-4 md:py-3">{l.title}</td>
                  <td className="order-last text-slate-500 md:order-none md:px-4 md:py-3">{monthName(l.month)}</td>
                  <td className="order-last md:order-none md:px-4 md:py-3">
                    <div className="flex flex-wrap gap-1">
                      {LEVEL_KEYS.map((k) => {
                        const n = l.tasks.find((t) => t.level === k)?.items.length || 0;
                        return (
                          <span
                            key={k}
                            title={LEVELS[k].name}
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                              n ? LEVELS[k].badge : "bg-slate-50 text-slate-300 ring-slate-100"
                            }`}
                          >
                            {LEVELS[k].short} {n}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="ml-auto md:ml-0 md:px-4 md:py-3">
                    <div className="flex justify-end gap-1">
                      <a
                        href={`/dars/${l.id}`}
                        target="_blank"
                        rel="noopener"
                        title="Saytda ko'rish"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Link
                        to={`/admin/darslar/${l.dbId}`}
                        title="Tahrirlash"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setToDelete(l)}
                        title="O'chirish"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Darsni o'chirish"
        text={toDelete ? `"${toDelete.id}-dars: ${toDelete.title}" va uning barcha topshiriqlari o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.` : ""}
        loading={deleting}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}

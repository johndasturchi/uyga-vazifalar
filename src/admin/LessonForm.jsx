import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Film,
  ImagePlus,
  Link2,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { api, makeImageVariant, makeVideoPoster, uploadFile } from "./api.js";
import { Button, Field, IconButton, Spinner, inputClass, useToast } from "./ui.jsx";
import { LEVELS, LEVEL_KEYS } from "../lib/meta.js";
import { useData } from "../lib/data.jsx";

let keySeq = 0;
const newKey = () => `k${++keySeq}`;

function emptyTasks() {
  return { sodda: [], orta: [], murakkab: [] };
}

function ItemCard({ item, index, total, onMove, onRemove, onChange }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 sm:w-36">
        {item.type === "image" && (
          <img src={item.preview || item.view || item.src} alt="" className="h-20 w-full object-cover sm:h-24" />
        )}
        {item.type === "video" &&
          (item.poster || item.previewPoster ? (
            <img src={item.previewPoster || item.poster} alt="" className="h-20 w-full object-cover sm:h-24" />
          ) : (
            <Film className="h-8 w-8 text-slate-300" />
          ))}
        {item.type === "link" && <Link2 className="h-8 w-8 text-slate-300" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {item.type === "image" ? "Rasm" : item.type === "video" ? "Video" : "Havola"}
        </p>
        {item.type === "link" ? (
          <input
            value={item.url || ""}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://www.figma.com/..."
            className={`${inputClass} mt-1 h-10`}
          />
        ) : item.uploading ? (
          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Yuklanmoqda... {Math.round(item.progress || 0)}%
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${item.progress || 0}%` }} />
            </div>
          </div>
        ) : (
          <a
            href={item.src}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-sm text-blue-600 hover:underline"
          >
            {decodeURIComponent(item.src.split("/").pop())}
          </a>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-center sm:flex-row sm:items-start">
        <IconButton title="Yuqoriga" disabled={index === 0} onClick={() => onMove(-1)}>
          <ArrowUp className="h-4 w-4" />
        </IconButton>
        <IconButton title="Pastga" disabled={index === total - 1} onClick={() => onMove(1)}>
          <ArrowDown className="h-4 w-4" />
        </IconButton>
        <IconButton title="O'chirish" onClick={onRemove} className="text-rose-500 hover:bg-rose-50 hover:text-rose-700">
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

export default function LessonForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const { reload } = useData();

  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [monthId, setMonthId] = useState("");
  const [tasks, setTasks] = useState(emptyTasks);
  const [error, setError] = useState("");
  const fileInputs = useRef({});

  useEffect(() => {
    (async () => {
      try {
        const [lessons, m] = await Promise.all([api("lessons"), api("months")]);
        setMonths(m);
        if (isNew) {
          const last = lessons[lessons.length - 1];
          setNumber(String((last?.id || 0) + 1));
          setMonthId(String(last?.month || m[m.length - 1]?.id || ""));
        } else {
          const lesson = lessons.find((l) => String(l.dbId) === id);
          if (!lesson) {
            toast("Dars topilmadi", "error");
            return navigate("/admin/darslar", { replace: true });
          }
          setNumber(String(lesson.id));
          setTitle(lesson.title);
          setMonthId(String(lesson.month));
          const t = emptyTasks();
          lesson.tasks.forEach((task) => {
            t[task.level] = task.items.map((it) => ({ ...it, key: newKey() }));
          });
          setTasks(t);
        }
      } catch (e) {
        toast(e.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateItem = (level, key, patch) =>
    setTasks((t) => ({ ...t, [level]: t[level].map((it) => (it.key === key ? { ...it, ...patch } : it)) }));

  const removeItem = (level, key) => setTasks((t) => ({ ...t, [level]: t[level].filter((it) => it.key !== key) }));

  const moveItem = (level, index, dir) =>
    setTasks((t) => {
      const list = [...t[level]];
      const [it] = list.splice(index, 1);
      list.splice(index + dir, 0, it);
      return { ...t, [level]: list };
    });

  const folder = () => `darslar/${number || "yangi"}`;

  const addLink = (level) =>
    setTasks((t) => ({ ...t, [level]: [...t[level], { key: newKey(), type: "link", url: "" }] }));

  const handleFiles = async (level, files, kind) => {
    for (const file of Array.from(files)) {
      const key = newKey();
      const isImage = kind === "image";
      if (isImage && !file.type.startsWith("image/")) {
        toast(`${file.name} rasm emas`, "error");
        continue;
      }
      if (!isImage && !file.type.startsWith("video/")) {
        toast(`${file.name} video emas`, "error");
        continue;
      }
      const preview = isImage ? URL.createObjectURL(file) : null;
      setTasks((t) => ({
        ...t,
        [level]: [...t[level], { key, type: kind, uploading: true, progress: 0, preview }],
      }));
      try {
        if (isImage) {
          const variant = await makeImageVariant(file, 1280);
          const base = `${level}-${file.name}`;
          const viewUrl = await uploadFile(variant.blob, `${folder()}/view`, base.replace(/\.[^.]+$/, "") + ".webp");
          const src = await uploadFile(file, folder(), base, (p) => updateItem(level, key, { progress: p }));
          updateItem(level, key, { uploading: false, src, view: viewUrl, w: variant.w, h: variant.h });
        } else {
          const poster = await makeVideoPoster(file);
          let posterUrl = null;
          if (poster) {
            updateItem(level, key, { previewPoster: URL.createObjectURL(poster.blob) });
            posterUrl = await uploadFile(poster.blob, `${folder()}/view`, `${level}-poster.jpg`);
          }
          const src = await uploadFile(file, folder(), `${level}-${file.name}`, (p) => updateItem(level, key, { progress: p }));
          updateItem(level, key, { uploading: false, src, poster: posterUrl, w: poster?.w, h: poster?.h });
        }
      } catch (e) {
        removeItem(level, key);
        toast(`${file.name}: ${e.message || "yuklab bo'lmadi"}`, "error");
      }
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const all = LEVEL_KEYS.flatMap((k) => tasks[k]);
    if (all.some((it) => it.uploading)) return setError("Fayllar yuklanib bo'lishini kuting");
    if (!title.trim()) return setError("Dars nomini kiriting");
    if (!monthId) return setError("Oyni tanlang");
    if (all.some((it) => it.type === "link" && !/^https?:\/\//i.test((it.url || "").trim())))
      return setError("Havolalar http:// yoki https:// bilan boshlanishi kerak");

    const payload = {
      number: Number(number),
      title: title.trim(),
      monthId: Number(monthId),
      tasks: LEVEL_KEYS.map((level) => ({
        level,
        items: tasks[level].map(({ type, src, view, poster, url, w, h }) => ({ type, src, view, poster, url, w, h })),
      })),
    };
    setSaving(true);
    try {
      if (isNew) await api("lessons", { method: "POST", body: payload });
      else await api(`lessons?id=${id}`, { method: "PUT", body: payload });
      toast(isNew ? "Dars qo'shildi" : "O'zgarishlar saqlandi");
      reload();
      navigate("/admin/darslar");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  if (!months.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
        <p className="font-medium">Avval kamida bitta oy qo'shing</p>
        <Link to="/admin/oylar" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline">
          Oylar bo'limiga o'tish →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="pb-24">
      <Link
        to="/admin/darslar"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Darslar ro'yxati
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{isNew ? "Yangi dars" : "Darsni tahrirlash"}</h1>

      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[140px_1fr_200px] sm:p-6">
        <Field label="Dars raqami" hint="Saytdagi tartib">
          <input
            type="number"
            min="1"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className={inputClass}
            required
          />
        </Field>
        <Field label="Dars nomi (mavzu)">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masalan: FlexBox (1-qism)"
            className={inputClass}
            required
          />
        </Field>
        <Field label="Oy">
          <select value={monthId} onChange={(e) => setMonthId(e.target.value)} className={inputClass} required>
            <option value="">Tanlang</option>
            {months.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
                {m.desc ? ` — ${m.desc}` : ""}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 space-y-5">
        {LEVEL_KEYS.map((level) => {
          const lv = LEVELS[level];
          const list = tasks[level];
          return (
            <section key={level} className="overflow-hidden rounded-2xl border border-slate-200">
              <div className={`h-1 ${lv.bar}`} />
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${lv.dot}`} />
                    <h2 className="font-semibold">{lv.name}</h2>
                    <span className="text-sm text-slate-400">{list.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" className="py-2" onClick={() => fileInputs.current[`${level}-image`].click()}>
                      <ImagePlus className="h-4 w-4" />
                      Rasm
                    </Button>
                    <Button type="button" variant="secondary" className="py-2" onClick={() => fileInputs.current[`${level}-video`].click()}>
                      <Film className="h-4 w-4" />
                      Video
                    </Button>
                    <Button type="button" variant="secondary" className="py-2" onClick={() => addLink(level)}>
                      <Link2 className="h-4 w-4" />
                      Havola
                    </Button>
                    <input
                      ref={(el) => (fileInputs.current[`${level}-image`] = el)}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        handleFiles(level, e.target.files, "image");
                        e.target.value = "";
                      }}
                    />
                    <input
                      ref={(el) => (fileInputs.current[`${level}-video`] = el)}
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={(e) => {
                        handleFiles(level, e.target.files, "video");
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>

                {list.length === 0 ? (
                  <p className="mt-4 rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
                    Bu darajada topshiriq yo'q — saytda ko'rinmaydi
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {list.map((item, i) => (
                      <ItemCard
                        key={item.key}
                        item={item}
                        index={i}
                        total={list.length}
                        onMove={(dir) => moveItem(level, i, dir)}
                        onRemove={() => removeItem(level, item.key)}
                        onChange={(patch) => updateItem(level, item.key, patch)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="min-w-0 truncate text-sm text-rose-600">{error}</p>
          <div className="flex shrink-0 gap-2">
            <Link to="/admin/darslar">
              <Button type="button" variant="secondary">
                Bekor qilish
              </Button>
            </Link>
            <Button type="submit" loading={saving}>
              <Save className="h-4 w-4" />
              Saqlash
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

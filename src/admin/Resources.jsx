import { useEffect, useRef, useState } from "react";
import { Film, Image as ImageIcon, Loader2, Music, Trash2, Upload } from "lucide-react";
import { api, makeImageVariant, makeVideoPoster, uploadFile } from "./api.js";
import { Button, ConfirmModal, Spinner, inputClass, useToast } from "./ui.jsx";
import { useData } from "../lib/data.jsx";

const TABS = [
  { key: "images", kind: "image", name: "Rasmlar", icon: ImageIcon, accept: "image/*", label: "Rasm" },
  { key: "videos", kind: "video", name: "Videolar", icon: Film, accept: "video/*", label: "Video" },
  { key: "musics", kind: "music", name: "Musiqalar", icon: Music, accept: "audio/*", label: "Musiqa" },
];

function TitleInput({ item, placeholder, onSave }) {
  const [value, setValue] = useState(item.title || "");
  useEffect(() => setValue(item.title || ""), [item.title]);
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => value !== (item.title || "") && onSave(value)}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      placeholder={placeholder}
      className={`${inputClass} h-9`}
    />
  );
}

export default function AdminResources() {
  const toast = useToast();
  const { reload } = useData();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(TABS[0]);
  const [uploads, setUploads] = useState([]); // { id, name, progress }
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const input = useRef(null);

  const load = async () => {
    try {
      setData(await api("resources"));
    } catch (e) {
      toast(e.message, "error");
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setProgress = (id, progress) => setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress } : x)));

  const handleFiles = async (files, current) => {
    for (const file of Array.from(files)) {
      const prefix = current.accept.split("/")[0];
      if (!file.type.startsWith(prefix)) {
        toast(`${file.name}: noto'g'ri fayl turi`, "error");
        continue;
      }
      const id = Math.random();
      setUploads((u) => [...u, { id, name: file.name, progress: 0 }]);
      try {
        const body = { kind: current.kind, title: file.name.replace(/\.[^.]+$/, "") };
        if (current.kind === "image") {
          const view = await makeImageVariant(file, 1600);
          const thumb = await makeImageVariant(file, 480, 0.7);
          body.view = await uploadFile(view.blob, "resurslar/view", file.name.replace(/\.[^.]+$/, ".webp"));
          body.thumb = await uploadFile(thumb.blob, "resurslar/thumb", file.name.replace(/\.[^.]+$/, ".webp"));
        }
        if (current.kind === "video") {
          const poster = await makeVideoPoster(file);
          if (poster) body.poster = await uploadFile(poster.blob, "resurslar/view", "poster.jpg");
        }
        body.src = await uploadFile(file, "resurslar", file.name, (p) => setProgress(id, p));
        await api("resources", { method: "POST", body });
        toast(`${file.name} qo'shildi`);
      } catch (e) {
        toast(`${file.name}: ${e.message || "yuklab bo'lmadi"}`, "error");
      } finally {
        setUploads((u) => u.filter((x) => x.id !== id));
      }
    }
    await load();
    reload();
  };

  const saveTitle = async (item, title) => {
    try {
      await api(`resources?id=${item.id}`, { method: "PUT", body: { title } });
      toast("Nomi saqlandi");
      await load();
      reload();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api(`resources?id=${toDelete.id}`, { method: "DELETE" });
      toast("O'chirildi");
      setToDelete(null);
      await load();
      reload();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const items = data?.[tab.key] || [];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resurslar</h1>
          <p className="mt-1 text-sm text-slate-500">O'quvchilar topshiriqlarda ishlatadigan fayllar.</p>
        </div>
        <Button onClick={() => input.current.click()} className="w-full sm:w-auto">
          <Upload className="h-4 w-4" />
          {tab.label} yuklash
        </Button>
        <input
          ref={input}
          type="file"
          accept={tab.accept}
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files, tab);
            e.target.value = "";
          }}
        />
      </div>

      <div className="mt-6 inline-flex rounded-xl bg-slate-100 p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                t.key === tab.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.name}
              <span className="text-xs text-slate-400">{data?.[t.key]?.length ?? ""}</span>
            </button>
          );
        })}
      </div>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploads.map((u) => (
            <div key={u.id} className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="truncate">{u.name}</span>
                <span className="ml-auto text-slate-500">{Math.round(u.progress)}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${u.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!data ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          Hali {tab.name.toLowerCase()} yo'q
        </div>
      ) : (
        <div
          className={`mt-6 grid gap-4 ${
            tab.kind === "image" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-2"
          }`}
        >
          {items.map((it, i) => (
            <div key={it.id} className="overflow-hidden rounded-xl border border-slate-200">
              {tab.kind === "image" && (
                <img src={it.thumb} alt="" loading="lazy" className="aspect-[4/3] w-full bg-slate-100 object-cover" />
              )}
              {tab.kind === "video" && (
                <video controls preload="none" poster={it.poster || undefined} src={it.src} className="aspect-video w-full bg-black" />
              )}
              {tab.kind === "music" && (
                <div className="p-3 pb-0">
                  <audio controls preload="none" src={it.src} className="w-full" />
                </div>
              )}
              <div className="flex items-center gap-2 p-3">
                <TitleInput item={it} placeholder={`${tab.label} ${i + 1}`} onSave={(title) => saveTitle(it, title)} />
                <button
                  onClick={() => setToDelete(it)}
                  title="O'chirish"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Resursni o'chirish"
        text={`"${toDelete?.title || "Fayl"}" saytdan o'chiriladi.`}
        loading={deleting}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}

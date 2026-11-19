import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Image as ImageIcon, Film, Music } from "lucide-react";
import { resources } from "../data/lessons.js";
import { fileName } from "../lib/meta.js";
import Lightbox from "../components/Lightbox.jsx";

const TABS = [
  { id: "rasmlar", name: "Rasmlar", icon: ImageIcon, key: "images" },
  { id: "videolar", name: "Videolar", icon: Film, key: "videos" },
  { id: "musiqalar", name: "Musiqalar", icon: Music, key: "musics" },
];

function DownloadBtn({ src }) {
  return (
    <a
      href={src}
      download={fileName(src)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      <Download className="h-4 w-4" />
      Yuklab olish
    </a>
  );
}

export default function Resources() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.id === params.get("tur")) || TABS[0];
  const [zoom, setZoom] = useState(null);
  const items = resources[tab.key];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resurslar</h1>
      <p className="mt-2 text-slate-500">Topshiriqlarda ishlatish uchun rasm, video va musiqalar.</p>

      <div className="mt-8 inline-flex rounded-xl bg-slate-100 p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.id === tab.id;
          return (
            <button
              key={t.id}
              onClick={() => setParams({ tur: t.id }, { replace: true })}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.name}
              <span className="text-xs text-slate-400">{resources[t.key].length}</span>
            </button>
          );
        })}
      </div>

      {tab.key === "images" && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-xl border border-slate-200">
              <button onClick={() => setZoom(src)} className="block aspect-[4/3] w-full overflow-hidden bg-slate-50">
                <img
                  src={src}
                  alt={`Rasm ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </button>
              <div className="flex flex-col items-start gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium">Rasm {i + 1}</span>
                <DownloadBtn src={src} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab.key === "videos" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-xl border border-slate-200">
              <video controls preload="metadata" src={src} className="aspect-video w-full bg-black" />
              <div className="flex items-center justify-between p-3">
                <span className="text-sm font-medium">Video {i + 1}</span>
                <DownloadBtn src={src} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab.key === "musics" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((src, i) => (
            <div key={src} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Music className="h-5 w-5" />
                  </span>
                  <span className="font-medium">Musiqa {i + 1}</span>
                </div>
                <DownloadBtn src={src} />
              </div>
              <audio controls preload="none" src={src} className="w-full" />
            </div>
          ))}
        </div>
      )}

      <Lightbox src={zoom} onClose={() => setZoom(null)} />
    </div>
  );
}

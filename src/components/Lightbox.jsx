import { useEffect } from "react";
import { X, Download } from "lucide-react";
import { fileName } from "../lib/meta.js";

export default function Lightbox({ src, onClose }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-end gap-2 p-3 sm:p-4" onClick={(e) => e.stopPropagation()}>
        <a
          href={src}
          download={fileName(src)}
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Yuklab olish</span>
        </a>
        <button
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
          aria-label="Yopish"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto p-3 sm:p-6">
        <img
          src={src}
          alt=""
          className="max-h-full max-w-full rounded-lg bg-white object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

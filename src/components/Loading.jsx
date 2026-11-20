import { RefreshCw } from "lucide-react";
import { useData } from "../lib/data.jsx";

/** Ma'lumot hali kelmagan bo'lsa skeleton yoki xato ko'rsatadi, aks holda children(data) ni chizadi. */
export default function WithData({ children }) {
  const { data, error, reload } = useData();

  if (data) return children(data);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <p className="font-medium">Ma'lumotlarni yuklab bo'lmadi</p>
        <p className="mt-1 text-sm text-slate-500">Internet aloqasini tekshirib, qayta urinib ko'ring.</p>
        <button
          onClick={reload}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-8 sm:px-8 sm:py-10">
      <div className="h-4 w-24 rounded bg-slate-100" />
      <div className="mt-3 h-8 w-64 rounded bg-slate-100" />
      <div className="mt-8 h-72 rounded-2xl bg-slate-100" />
      <div className="mt-6 h-72 rounded-2xl bg-slate-100" />
    </div>
  );
}

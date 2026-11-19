import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-slate-200">404</p>
      <h1 className="mt-4 text-xl font-semibold">Sahifa topilmadi</h1>
      <p className="mt-2 text-slate-500">Bunday dars yoki sahifa mavjud emas.</p>
      <Link to="/" className="mt-6 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700">
        Darslarga qaytish
      </Link>
    </div>
  );
}

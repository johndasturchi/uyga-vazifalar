import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  return (
    <div className="min-h-screen">
      {/* Kompyuter: doimiy chap menyu */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-100 bg-white lg:block">
        <Sidebar />
      </aside>

      {/* Mobil: yuqori panel */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Link to="/">
          <img src="/logo.png" alt="Meta IT School" width="107" height="32" className="h-8 w-auto" />
        </Link>
        <button
          onClick={() => setDrawer(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          aria-label="Menyuni ochish"
        >
          <Menu className="h-4 w-4" />
          Darslar
        </button>
      </header>

      {/* Mobil: chiqadigan menyu */}
      <div className={`fixed inset-0 z-40 lg:hidden ${drawer ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setDrawer(false)}
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[85%] max-w-xs bg-white shadow-xl transition-transform duration-200 ${
            drawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setDrawer(false)}
            className="absolute right-3 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
          <Sidebar onNavigate={() => setDrawer(false)} />
        </aside>
      </div>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Meta IT School · Uyga vazifalar
        </footer>
      </div>
    </div>
  );
}

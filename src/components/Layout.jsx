import { useEffect } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { BookOpen, FolderOpen } from "lucide-react";

const navClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
  }`;

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="Meta IT School" className="h-8 w-auto sm:h-9" />
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              <BookOpen className="h-4 w-4" />
              <span>Darslar</span>
            </NavLink>
            <NavLink to="/resurslar" className={navClass}>
              <FolderOpen className="h-4 w-4" />
              <span>Resurslar</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-400 sm:px-6">
          © {new Date().getFullYear()} Meta IT School · Uyga vazifalar
        </div>
      </footer>
    </div>
  );
}

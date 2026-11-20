import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, Link } from "react-router-dom";
import { BookOpen, CalendarDays, ExternalLink, FolderOpen, LogOut } from "lucide-react";
import { getToken, setToken } from "./api.js";
import { ToastProvider } from "./ui.jsx";
import Login from "./Login.jsx";
import Lessons from "./Lessons.jsx";
import LessonForm from "./LessonForm.jsx";
import Months from "./Months.jsx";
import AdminResources from "./Resources.jsx";

const tabClass = ({ isActive }) =>
  `inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  }`;

export default function AdminApp() {
  const [authed, setAuthed] = useState(Boolean(getToken()));

  useEffect(() => {
    const out = () => setAuthed(false);
    window.addEventListener("admin:logout", out);
    return () => window.removeEventListener("admin:logout", out);
  }, []);

  useEffect(() => {
    document.title = "Admin panel — Uyga vazifalar";
    return () => {
      document.title = "Uyga vazifalar — Meta IT School";
    };
  }, []);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const logout = () => {
    setToken(null);
    setAuthed(false);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link to="/admin" className="flex items-center gap-3">
              <img src="/logo.png" alt="" width="107" height="32" className="h-8 w-auto" />
              <span className="hidden rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white sm:inline">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <a
                href="/"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Saytni ochish</span>
              </a>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          </div>
          <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
            <NavLink to="/admin/darslar" className={tabClass}>
              <BookOpen className="h-4 w-4" />
              Darslar
            </NavLink>
            <NavLink to="/admin/oylar" className={tabClass}>
              <CalendarDays className="h-4 w-4" />
              Oylar
            </NavLink>
            <NavLink to="/admin/resurslar" className={tabClass}>
              <FolderOpen className="h-4 w-4" />
              Resurslar
            </NavLink>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Routes>
            <Route index element={<Navigate to="darslar" replace />} />
            <Route path="darslar" element={<Lessons />} />
            <Route path="darslar/yangi" element={<LessonForm />} />
            <Route path="darslar/:id" element={<LessonForm />} />
            <Route path="oylar" element={<Months />} />
            <Route path="resurslar" element={<AdminResources />} />
            <Route path="*" element={<Navigate to="darslar" replace />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}

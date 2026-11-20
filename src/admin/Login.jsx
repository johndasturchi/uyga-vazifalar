import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { api, setToken } from "./api.js";
import { Button, inputClass } from "./ui.jsx";

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return setError("Parolni kiriting");
    setLoading(true);
    setError("");
    try {
      const { token } = await api("login", { method: "POST", body: { password } });
      setToken(token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <img src="/logo.png" alt="Meta IT School" width="120" height="36" className="h-9 w-auto" />
        <h1 className="mt-6 text-xl font-semibold">Admin panelga kirish</h1>
        <p className="mt-1 text-sm text-slate-500">Darslarni boshqarish uchun parolni kiriting.</p>

        <div className="relative mt-6">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            autoFocus
            autoComplete="current-password"
            className={`${inputClass} pl-9 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:text-slate-700"
            aria-label={show ? "Parolni yashirish" : "Parolni ko'rsatish"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

        <Button type="submit" loading={loading} className="mt-5 w-full">
          Kirish
        </Button>
        <a href="/" className="mt-4 block text-center text-sm text-slate-500 hover:text-slate-900">
          ← Saytga qaytish
        </a>
      </form>
    </div>
  );
}

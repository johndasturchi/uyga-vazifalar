import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "./api.js";
import { Button, ConfirmModal, Field, Modal, Spinner, inputClass, useToast } from "./ui.jsx";
import { useData } from "../lib/data.jsx";

const EMPTY = { name: "", desc: "", order: "" };

export default function Months() {
  const toast = useToast();
  const { reload } = useData();
  const [months, setMonths] = useState(null);
  const [form, setForm] = useState(null); // { id?, name, desc, order }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setMonths(await api("months"));
    } catch (e) {
      toast(e.message, "error");
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    const next = (months?.reduce((max, m) => Math.max(max, m.order), 0) || 0) + 1;
    setError("");
    setForm({ ...EMPTY, name: `${next}-oy`, order: String(next) });
  };

  const openEdit = (m) => {
    setError("");
    setForm({ id: m.id, name: m.name, desc: m.desc, order: String(m.order) });
  };

  const save = async (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return setError("Oy nomini kiriting");
    setSaving(true);
    setError("");
    try {
      const body = { name: form.name, desc: form.desc, order: Number(form.order) || 0 };
      if (form.id) await api(`months?id=${form.id}`, { method: "PUT", body });
      else await api("months", { method: "POST", body });
      toast(form.id ? "Oy yangilandi" : "Oy qo'shildi");
      setForm(null);
      await load();
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api(`months?id=${toDelete.id}`, { method: "DELETE" });
      toast(`${toDelete.name} o'chirildi`);
      setToDelete(null);
      await load();
      reload();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Oylar</h1>
          <p className="mt-1 text-sm text-slate-500">Darslar shu oylar bo'yicha guruhlanadi.</p>
        </div>
        <Button onClick={openNew} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Yangi oy
        </Button>
      </div>

      {!months ? (
        <Spinner />
      ) : months.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          Hali oylar yo'q
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {months.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-semibold text-blue-700">
                {m.order}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{m.name}</p>
                <p className="truncate text-sm text-slate-500">{m.desc || "Tavsif yo'q"}</p>
                <p className="mt-0.5 text-xs text-slate-400">{m.lessons} ta dars</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(m)}
                  title="Tahrirlash"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setToDelete(m)}
                  title="O'chirish"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(form)}
        title={form?.id ? "Oyni tahrirlash" : "Yangi oy"}
        onClose={() => setForm(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setForm(null)}>
              Bekor qilish
            </Button>
            <Button loading={saving} onClick={save}>
              Saqlash
            </Button>
          </>
        }
      >
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-[1fr_110px] gap-3">
              <Field label="Nomi">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="5-oy"
                  className={inputClass}
                  autoFocus
                />
              </Field>
              <Field label="Tartib">
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Tavsif" hint="Saytda oy nomi yonida ko'rinadi">
              <input
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Masalan: JavaScript asoslari"
                className={inputClass}
              />
            </Field>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button type="submit" hidden />
          </form>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Oyni o'chirish"
        text={
          toDelete?.lessons
            ? `${toDelete.name}da ${toDelete.lessons} ta dars bor. Avval ularni boshqa oyga o'tkazing yoki o'chiring.`
            : `"${toDelete?.name}" o'chiriladi.`
        }
        loading={deleting}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}

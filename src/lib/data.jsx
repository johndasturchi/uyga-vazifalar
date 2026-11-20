import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CACHE_KEY = "uyga-vazifalar:data:v1";
const DataContext = createContext(null);

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* xotira to'la yoki yopiq */
  }
}

export function DataProvider({ children }) {
  // Avval saqlangan nusxa darhol ko'rsatiladi, yangisi fonda yuklanadi
  const [data, setData] = useState(readCache);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Ma'lumotlarni yuklab bo'lmadi");
      const json = await res.json();
      setData(json);
      setError(null);
      writeCache(json);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return <DataContext.Provider value={{ data, error, reload: load }}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}

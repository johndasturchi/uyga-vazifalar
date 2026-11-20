import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Lesson from "./pages/Lesson.jsx";
import Resources from "./pages/Resources.jsx";
import NotFound from "./pages/NotFound.jsx";
import { DataProvider } from "./lib/data.jsx";

// Admin panel alohida yuklanadi — o'quvchilar uchun sayt yengil qoladi
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route
          path="admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dars/:id" element={<Lesson />} />
          <Route path="resurslar" element={<Resources />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}

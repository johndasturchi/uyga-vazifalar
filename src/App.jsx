import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Lesson from "./pages/Lesson.jsx";
import Resources from "./pages/Resources.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dars/:id" element={<Lesson />} />
        <Route path="resurslar" element={<Resources />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

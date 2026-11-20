// Bazadagi yozuvlarni sayt kutadigan ko'rinishga keltirish
const LEVELS = ["sodda", "orta", "murakkab"];

export function shapeItem(it) {
  const out = { id: it.id, type: it.type };
  for (const k of ["src", "view", "poster", "url", "w", "h"]) if (it[k] != null) out[k] = it[k];
  return out;
}

export function shapeLesson(l) {
  const tasks = LEVELS.map((level) => ({
    level,
    items: l.items
      .filter((it) => it.level === level)
      .sort((a, b) => a.order - b.order || a.id - b.id)
      .map(shapeItem),
  })).filter((t) => t.items.length);
  return { id: l.number, dbId: l.id, month: l.monthId, title: l.title, tasks };
}

export function shapeResources(rows) {
  const by = (kind) => rows.filter((r) => r.kind === kind).sort((a, b) => a.order - b.order || a.id - b.id);
  return {
    images: by("image").map((r) => ({ id: r.id, title: r.title, src: r.src, view: r.view || r.src, thumb: r.thumb || r.view || r.src })),
    videos: by("video").map((r) => ({ id: r.id, title: r.title, src: r.src, poster: r.poster })),
    musics: by("music").map((r) => ({ id: r.id, title: r.title, src: r.src })),
  };
}

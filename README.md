# Uyga vazifalar — Meta IT School

Frontend kursining 48 ta darsi bo'yicha uyga vazifalar sayti (React + Vite + TailwindCSS).

## Ishga tushirish (kompyuterda)

```bash
npm install
npm run dev
```

Brauzerda `http://localhost:5173` ni oching.

## Yangi dars qo'shish

1. Topshiriq rasmlarini `public/files/lessons/` papkasiga joylang (masalan `lesson49_1.png`).
2. `src/data/lessons.js` faylidagi `lessons` ro'yxatining oxiriga yangi obyekt qo'shing:

```js
{
  "id": 49,
  "month": 5,
  "title": "JavaScript asoslari",
  "tasks": [
    { "level": "sodda",    "items": [{ "type": "image", "src": "/files/lessons/lesson49_1.png" }] },
    { "level": "orta",     "items": [{ "type": "image", "src": "/files/lessons/lesson49_2.png" }] },
    { "level": "murakkab", "items": [{ "type": "link",  "url": "https://www.figma.com/..." }] }
  ]
}
```

- `type`: `image` (rasm), `video` (mp4) yoki `link` (Figma / boshqa sayt havolasi)
- Yangi oy qo'shsangiz, `src/lib/meta.js` faylidagi `MONTHS` ro'yxatiga ham qo'shing.

## Deploy

GitHub'ga yuklang va Vercel'da shu repozitoriyni import qiling — sozlamalar avtomatik aniqlanadi (Framework: Vite).

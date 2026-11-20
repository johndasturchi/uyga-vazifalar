# Uyga vazifalar — Meta IT School

Frontend kursi bo'yicha uyga vazifalar sayti va admin panel.

- **Sayt:** React + Vite + TailwindCSS
- **Admin panel:** `/admin` manzilida (parol bilan kiriladi)
- **Server:** Vercel Functions (`api/` papkasi)
- **Baza:** Neon PostgreSQL + Prisma ORM
- **Fayllar:** Vercel Blob (admin panel orqali yuklangan rasm, video, musiqa)

## Admin panel

`https://amaliyotlar.vercel.app/admin` ga kiring va parolni yozing. U yerda:

- **Darslar** — dars qo'shish, tahrirlash, o'chirish; har bir darajaga (sodda / o'rta / murakkab) rasm, video yoki havola qo'shish
- **Oylar** — yangi oy qo'shish, nomi va tavsifini o'zgartirish
- **Resurslar** — rasm, video va musiqa yuklash yoki o'chirish

Yuklangan rasmlarning yengil nusxasi brauzerda avtomatik tayyorlanadi, shuning uchun sayt tez ochiladi. O'zgarishlar saytda darhol ko'rinadi.

### Parolni o'zgartirish

Vercel → loyiha → **Settings → Environment Variables** → `ADMIN_PASSWORD` ni tahrirlang, so'ng **Deployments** bo'limida oxirgi deploy uchun **Redeploy** ni bosing.

## Muhit o'zgaruvchilari (Vercel'da sozlangan)

| Nomi | Vazifasi |
|------|----------|
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Neon baza (Vercel Marketplace orqali ulangan) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob fayl ombori |
| `ADMIN_PASSWORD` | Admin panel paroli |
| `ADMIN_SECRET` | Kirish tokenlarini imzolash kaliti |

## Deploy

Production build paytida `scripts/db-setup.mjs` avtomatik ishlaydi: Prisma migratsiyalarini bazaga qo'llaydi va baza bo'sh bo'lsa boshlang'ich 48 darsni yozadi (`prisma/seed-data.js`). Eski darslarning fayllari `public/files/` papkasida turadi.

```bash
npx vercel deploy --prod
```

## Kompyuterda ishga tushirish

```bash
npm install
npx vercel link          # loyihani ulash
npx vercel env pull      # .env.local faylini olish
npx vercel dev           # sayt + API
```

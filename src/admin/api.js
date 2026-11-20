import { upload } from "@vercel/blob/client";

const TOKEN_KEY = "uyga-vazifalar:admin";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* xotira yopiq */
  }
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() || ""}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* javob bo'sh */
  }
  if (res.status === 401) {
    setToken(null);
    window.dispatchEvent(new Event("admin:logout"));
  }
  if (!res.ok) throw new ApiError(res.status, data?.error || "Xatolik yuz berdi");
  return data;
}

function safeName(name) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
  return `${base || "fayl"}.${ext}`;
}

/** Faylni Vercel Blob'ga yuklaydi va uning URL manzilini qaytaradi. */
export async function uploadFile(file, folder, name, onProgress) {
  const blob = await upload(`${folder}/${safeName(name || file.name)}`, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ token: getToken() }),
    multipart: file.size > 20 * 1024 * 1024,
    onUploadProgress: onProgress ? ({ percentage }) => onProgress(percentage) : undefined,
  });
  return blob.url;
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Rasmni qayta ishlab bo'lmadi"))), type, quality)
  );
}

/** Rasmning yengil WebP nusxasini tayyorlaydi (sayt tez ochilishi uchun). */
export async function makeImageVariant(file, maxWidth, quality = 0.78) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await canvasToBlob(canvas, "image/webp", quality);
  return { blob, w, h };
}

/** Videodan muqova rasmi (poster) oladi. Muvaffaqiyatsiz bo'lsa null qaytaradi. */
export function makeVideoPoster(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    const done = (val) => {
      URL.revokeObjectURL(url);
      resolve(val);
    };
    const timer = setTimeout(() => done(null), 15000);
    video.onerror = () => {
      clearTimeout(timer);
      done(null);
    };
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    };
    video.onseeked = async () => {
      try {
        const scale = Math.min(1, 1280 / video.videoWidth);
        const w = Math.round(video.videoWidth * scale);
        const h = Math.round(video.videoHeight * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(video, 0, 0, w, h);
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.8);
        clearTimeout(timer);
        done({ blob, w, h });
      } catch {
        clearTimeout(timer);
        done(null);
      }
    };
    video.src = url;
  });
}

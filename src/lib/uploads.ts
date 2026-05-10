import path from "node:path";

export const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
}

export function getPublicUploadUrl(fileName: string) {
  return `/api/files/${fileName}`;
}

export function getImageContentType(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();

  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";

  return "application/octet-stream";
}

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireUser } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { allowedImageTypes, getPublicUploadUrl, getUploadDir } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await requireUser();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("Файл не найден", 400);
  }

  if (!allowedImageTypes.has(file.type)) {
    return jsonError("Поддерживаются JPG, PNG и WEBP", 400);
  }

  const ext = path.extname(file.name) || ".jpg";
  const safeName = `${Date.now()}-${crypto.randomUUID()}${ext.toLowerCase()}`;
  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), Buffer.from(await file.arrayBuffer()));

  return Response.json({ url: getPublicUploadUrl(safeName) });
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { getImageContentType, getUploadDir } from "@/lib/uploads";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

type Params = { params: Promise<{ name: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { name } = await params;
  const safeName = path.basename(name);

  if (safeName !== name) {
    return jsonError("Некорректное имя файла", 400);
  }

  try {
    const file = await readFile(path.join(getUploadDir(), safeName));

    return new Response(file, {
      headers: {
        "Content-Type": getImageContentType(safeName),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return jsonError("Файл не найден", 404);
  }
}

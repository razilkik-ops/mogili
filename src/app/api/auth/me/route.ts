import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Не авторизован", 401);
  return Response.json({ user });
}

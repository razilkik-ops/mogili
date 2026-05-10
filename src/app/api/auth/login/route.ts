import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { authCookie, createSession } from "@/lib/auth";
import { jsonError, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const data = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return jsonError("Неверный email или пароль", 401);
    }

    const token = await createSession({ userId: user.id, role: user.role });
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    response.cookies.set(authCookie.name, token, authCookie.options);
    return response;
  } catch (error) {
    if (!(error instanceof ZodError)) {
      console.error("Login failed", error);
      return jsonError("Сервис временно не может проверить логин. Проверьте подключение к базе данных.", 500);
    }

    return jsonError(parseValidationError(error), 400);
  }
}

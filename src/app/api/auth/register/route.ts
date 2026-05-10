import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { authCookie, createSession } from "@/lib/auth";
import { jsonError, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const data = registerSchema.parse(await request.json());
    const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (exists) {
      return jsonError("Пользователь с таким email уже существует", 409);
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: await bcrypt.hash(data.password, 12),
        role: "user",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = await createSession({ userId: user.id, role: user.role });
    const response = NextResponse.json({ user });
    response.cookies.set(authCookie.name, token, authCookie.options);
    return response;
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

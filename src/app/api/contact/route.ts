import { contactSchema } from "@/lib/validators";
import { clean, jsonError, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = contactSchema.parse(await request.json());
    const contact = await prisma.contactRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: clean(data.phone),
        message: data.message,
      },
    });

    return Response.json({ contact }, { status: 201 });
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

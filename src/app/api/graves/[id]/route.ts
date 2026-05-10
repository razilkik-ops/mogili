import { requireUser } from "@/lib/auth";
import { clean, dateOrNull, jsonError, numberOrNull, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { graveSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const grave = await prisma.grave.findFirst({
    where: { id, userId: user.id },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });

  if (!grave) return jsonError("Могила не найдена", 404);
  return Response.json({ grave });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const existing = await prisma.grave.findFirst({ where: { id, userId: user.id } });
  if (!existing) return jsonError("Могила не найдена", 404);

  try {
    const data = graveSchema.parse(await request.json());
    const grave = await prisma.grave.update({
      where: { id },
      data: {
        fullName: data.fullName,
        birthDate: dateOrNull(data.birthDate),
        deathDate: dateOrNull(data.deathDate),
        city: data.city,
        cemetery: data.cemetery,
        cemeteryAddress: clean(data.cemeteryAddress),
        section: clean(data.section),
        row: clean(data.row),
        place: clean(data.place),
        description: clean(data.description),
        photoUrl: clean(data.photoUrl),
        latitude: numberOrNull(data.latitude),
        longitude: numberOrNull(data.longitude),
      },
    });
    return Response.json({ grave });
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const existing = await prisma.grave.findFirst({ where: { id, userId: user.id } });
  if (!existing) return jsonError("Могила не найдена", 404);

  await prisma.grave.delete({ where: { id } });
  return Response.json({ ok: true });
}

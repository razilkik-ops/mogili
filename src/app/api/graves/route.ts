import { requireUser } from "@/lib/auth";
import { clean, dateOrNull, jsonError, numberOrNull, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { graveSchema } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();
  const graves = await prisma.grave.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { orders: { select: { id: true, status: true } } },
  });

  return Response.json({ graves });
}

export async function POST(request: Request) {
  const user = await requireUser();

  try {
    const data = graveSchema.parse(await request.json());
    const grave = await prisma.grave.create({
      data: {
        userId: user.id,
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
    return Response.json({ grave }, { status: 201 });
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

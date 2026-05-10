import { requireUser } from "@/lib/auth";
import { clean, jsonError, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { grave: true, reportPhotos: true },
  });

  return Response.json({ orders });
}

export async function POST(request: Request) {
  const user = await requireUser();

  try {
    const data = orderSchema.parse(await request.json());
    const grave = await prisma.grave.findFirst({ where: { id: data.graveId, userId: user.id } });
    if (!grave) return jsonError("Выберите доступную могилу", 404);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        graveId: data.graveId,
        serviceType: data.serviceType,
        reportType: data.reportType,
        contactMethod: data.contactMethod,
        contactValue: data.contactValue,
        preferredDate: new Date(data.preferredDate),
        userComment: clean(data.userComment),
      },
      include: { grave: true, reportPhotos: true },
    });

    return Response.json({ order }, { status: 201 });
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

import { requireUser } from "@/lib/auth";
import { clean, jsonError, parseValidationError } from "@/lib/api";
import { resolveDraftOrderStatus } from "@/lib/order-status";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { grave: true, reportPhotos: true },
  });

  if (!order) return jsonError("Заказ не найден", 404);
  return Response.json({ order });
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const existing = await prisma.order.findFirst({ where: { id, userId: user.id } });
  if (!existing) return jsonError("Заказ не найден", 404);
  if (!["NEW", "AWAITING_COMMUNICATION_LINK", "COMMUNICATION_LINK_ADDED"].includes(existing.status)) {
    return jsonError("Этот заказ уже нельзя изменить", 409);
  }

  try {
    const data = orderSchema.parse(await request.json());
    const order = await prisma.order.update({
      where: { id },
      data: {
        graveId: data.graveId,
        serviceType: data.serviceType,
        reportType: data.reportType,
        contactMethod: data.contactMethod,
        contactValue: data.contactValue,
        preferredDateTime: new Date(data.preferredDateTime),
        status: resolveDraftOrderStatus(data.serviceType, existing.status),
        userComment: clean(data.userComment),
      },
      include: { grave: true, reportPhotos: true },
    });
    return Response.json({ order });
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const existing = await prisma.order.findFirst({ where: { id, userId: user.id } });
  if (!existing) return jsonError("Заказ не найден", 404);

  const order = await prisma.order.update({ where: { id }, data: { status: "CANCELED" } });
  return Response.json({ order });
}

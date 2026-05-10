import { requireUser } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
  });

  if (!order) return jsonError("Заказ не найден", 404);
  if (order.serviceType !== "LIVE_CALL") return jsonError("Подтверждение доступно только для видеосвязи", 409);
  if (!order.communicationLink) return jsonError("Ссылка для связи ещё не добавлена", 409);
  if (order.status !== "COMMUNICATION_LINK_ADDED") {
    return jsonError("Эта заявка ещё не готова к подтверждению", 409);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: "SCHEDULED" },
    include: { grave: true, reportPhotos: true },
  });

  return Response.json({ order: updatedOrder });
}

import { requireUser } from "@/lib/auth";
import { jsonError, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { orderMessageSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const order = await prisma.order.findFirst({ where: { id, userId: user.id } });

  if (!order) return jsonError("Заказ не найден", 404);
  if (order.status === "CANCELED") return jsonError("Для отменённой заявки чат недоступен", 409);

  try {
    const data = orderMessageSchema.parse(await request.json());
    const message = await prisma.orderMessage.create({
      data: {
        orderId: id,
        authorId: user.id,
        senderRole: "user",
        body: data.body,
      },
    });

    return Response.json({ message }, { status: 201 });
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

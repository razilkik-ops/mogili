import { requireUser } from "@/lib/auth";
import { clean, jsonError, parseValidationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { orderQuestionSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await requireUser();
  const { id } = await params;
  const existing = await prisma.order.findFirst({ where: { id, userId: user.id } });

  if (!existing) return jsonError("Заказ не найден", 404);
  if (existing.status === "CANCELED") return jsonError("Для отменённой заявки вопрос отправить нельзя", 409);

  try {
    const data = orderQuestionSchema.parse(await request.json());
    const order = await prisma.order.update({
      where: { id },
      data: {
        customerQuestion: clean(data.customerQuestion),
      },
      include: { grave: true, reportPhotos: true },
    });

    return Response.json({ order });
  } catch (error) {
    return jsonError(parseValidationError(error), 400);
  }
}

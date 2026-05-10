import { OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { clean, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();
  const existing = await prisma.order.findUnique({ where: { id } });

  if (!existing) {
    return jsonError("Заказ не найден", 404);
  }

  if (body.status && !Object.values(OrderStatus).includes(body.status)) {
    return jsonError("Некорректный статус", 400);
  }

  const hasCommunicationLinkField = Object.prototype.hasOwnProperty.call(body, "communicationLink");
  const communicationLink = hasCommunicationLinkField ? clean(body.communicationLink) : undefined;
  const status =
    communicationLink &&
    (body.status === "AWAITING_COMMUNICATION_LINK" ||
      (!body.status && existing.status === "AWAITING_COMMUNICATION_LINK"))
      ? "COMMUNICATION_LINK_ADDED"
      : body.status;

  const order = await prisma.order.update({
    where: { id },
    data: {
      status,
      preferredDateTime: body.preferredDateTime ? new Date(body.preferredDateTime) : undefined,
      adminComment: clean(body.adminComment),
      communicationLink,
      videoReportUrl: clean(body.videoReportUrl),
      reportPhotos: Array.isArray(body.photoUrls)
        ? {
            deleteMany: {},
            createMany: {
              data: body.photoUrls.filter(Boolean).map((imageUrl: string) => ({ imageUrl })),
            },
          }
        : undefined,
    },
    include: { user: true, grave: true, reportPhotos: true },
  });

  return Response.json({ order });
}

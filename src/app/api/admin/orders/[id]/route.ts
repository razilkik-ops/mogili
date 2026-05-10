import { OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { clean, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();

  if (body.status && !Object.values(OrderStatus).includes(body.status)) {
    return jsonError("Некорректный статус", 400);
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      preferredDate: body.preferredDate ? new Date(body.preferredDate) : undefined,
      adminComment: clean(body.adminComment),
      zoomLink: clean(body.zoomLink),
      telegramLink: clean(body.telegramLink),
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

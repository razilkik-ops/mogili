import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderQuestionForm } from "@/components/order-question-form";
import { OrderStages } from "@/components/order-stages";
import { StatusBadge } from "@/components/status-badge";
import { requireUser } from "@/lib/auth";
import { contactLabels, reportLabels, serviceLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { grave: true, reportPhotos: true },
  });

  if (!order) notFound();

  return (
    <section className="container-page py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Заказ</p>
          <h1 className="display-title mt-3 text-5xl">{serviceLabels[order.serviceType]}</h1>
          <p className="mt-3 muted">{order.grave.fullName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-ink">Детали</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-graphite">Дата и время</dt>
                <dd className="font-medium text-ink">{formatDateTime(order.preferredDateTime)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-graphite">Отчёт</dt>
                <dd className="font-medium text-ink">{reportLabels[order.reportType]}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-graphite">Связь</dt>
                <dd className="font-medium text-ink">{contactLabels[order.contactMethod]}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-graphite">Контакт</dt>
                <dd className="font-medium text-ink">{order.contactValue}</dd>
              </div>
            </dl>
            <div className="mt-6 rounded-md bg-linen p-4">
              <p className="text-sm font-semibold text-ink">Комментарий пользователя</p>
              <p className="mt-2 muted">{order.userComment || "Нет комментария"}</p>
            </div>
            <div className="mt-4 rounded-md bg-linen p-4">
              <p className="text-sm font-semibold text-ink">Комментарий администратора</p>
              <p className="mt-2 muted">{order.adminComment || "Пока не добавлен"}</p>
            </div>
          </div>

          <OrderQuestionForm orderId={order.id} initialQuestion={order.customerQuestion} disabled={order.status === "CANCELED"} />
        </div>

        <div className="space-y-6">
          <OrderStages serviceType={order.serviceType} status={order.status} />
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-ink">Место захоронения</h2>
            <img src={order.grave.photoUrl || "/sample-grave.svg"} alt="" className="mt-4 h-56 w-full rounded-md object-cover" />
            <p className="mt-4 font-semibold text-ink">{order.grave.fullName}</p>
            <p className="muted">
              {order.grave.city}, {order.grave.cemetery}
            </p>
            {order.grave.cemeteryAddress ? <p className="muted">{order.grave.cemeteryAddress}</p> : null}
            <p className="muted">
              Сектор/участок/квартал {order.grave.section || "не указан"}, ряд {order.grave.row || "не указан"}, место{" "}
              {order.grave.place || "не указано"}
            </p>
            {order.grave.description ? <p className="mt-3 muted">Ориентиры: {order.grave.description}</p> : null}
            {order.grave.latitude && order.grave.longitude ? (
              <p className="mt-2 text-sm font-semibold text-moss">
                GPS: {order.grave.latitude}, {order.grave.longitude}
              </p>
            ) : null}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-ink">Отчёты и ссылки</h2>
            <div className="mt-4 space-y-2 text-sm text-graphite">
              <p>
                Видеоотчёт:{" "}
                {order.videoReportUrl ? (
                  <a className="font-semibold text-moss" href={order.videoReportUrl} target="_blank" rel="noreferrer">
                    открыть
                  </a>
                ) : (
                  "пока нет"
                )}
              </p>
              <p>
                Ссылка для связи:{" "}
                {order.communicationLink ? (
                  <a className="font-semibold text-moss" href={order.communicationLink} target="_blank" rel="noreferrer">
                    перейти
                  </a>
                ) : order.status === "AWAITING_COMMUNICATION_LINK" ? (
                  "администратор добавит её перед созвоном"
                ) : (
                  "пока нет"
                )}
              </p>
            </div>
            {order.reportPhotos.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {order.reportPhotos.map((photo) => (
                  <img key={photo.id} src={photo.imageUrl} alt="" className="h-44 w-full rounded-md border border-stonewarm object-cover" />
                ))}
              </div>
            ) : (
              <p className="mt-5 muted">Фотоотчёт появится здесь после загрузки администратором.</p>
            )}
          </div>
        </div>
      </div>

      <Link href="/dashboard" className="mt-6 inline-block text-sm font-semibold text-moss">
        Вернуться в кабинет
      </Link>
    </section>
  );
}

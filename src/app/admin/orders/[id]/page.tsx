import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderForm } from "@/components/admin-order-form";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { contactLabels, reportLabels, serviceLabels } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminOrderPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, grave: true, reportPhotos: true },
  });

  if (!order) notFound();

  return (
    <section className="container-page py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Админ-заказ</p>
          <h1 className="display-title mt-3 text-5xl">{serviceLabels[order.serviceType]}</h1>
          <p className="mt-3 muted">
            {order.user.name} - {order.grave.fullName}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink">Информация</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-graphite">Дата</dt>
              <dd className="font-medium text-ink">{formatDate(order.preferredDate)}</dd>
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
            <p className="text-sm font-semibold text-ink">Комментарий клиента</p>
            <p className="mt-2 muted">{order.userComment || "Нет комментария"}</p>
          </div>
          <div className="mt-5">
            <p className="text-sm font-semibold text-ink">Адрес</p>
            <p className="mt-2 muted">
              {order.grave.city}, {order.grave.cemetery}
            </p>
            {order.grave.cemeteryAddress ? <p className="muted">{order.grave.cemeteryAddress}</p> : null}
            <p className="muted">
              Сектор/участок/квартал {order.grave.section || "не указан"}, ряд {order.grave.row || "не указан"}, место{" "}
              {order.grave.place || "не указано"}
            </p>
            {order.grave.description ? <p className="mt-2 muted">Ориентиры: {order.grave.description}</p> : null}
            {order.grave.latitude && order.grave.longitude ? (
              <p className="mt-2 text-sm font-semibold text-moss">
                GPS: {order.grave.latitude}, {order.grave.longitude}
              </p>
            ) : null}
          </div>
        </div>

        <AdminOrderForm order={order} />
      </div>

      <Link href="/admin" className="mt-6 inline-block text-sm font-semibold text-moss">
        Вернуться в админ-панель
      </Link>
    </section>
  );
}

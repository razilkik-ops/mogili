import Link from "next/link";
import { Archive, ClipboardList, MapPinned, Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { requireUser } from "@/lib/auth";
import { serviceLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();
  const [graves, orders] = await Promise.all([
    prisma.grave.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { grave: true, reportPhotos: true },
    }),
  ]);

  const activeOrders = orders.filter((order) => !["COMPLETED", "CANCELED"].includes(order.status));
  const history = orders.filter((order) => ["COMPLETED", "CANCELED"].includes(order.status));

  return (
    <section className="container-page py-10">
      <div className="section-shell flex flex-col justify-between gap-6 p-6 md:flex-row md:items-end lg:p-8">
        <div>
          <p className="eyebrow">Личный кабинет</p>
          <h1 className="display-title mt-3 text-5xl sm:text-6xl">Здравствуйте, {user.name}</h1>
          <p className="mt-3 muted">Здесь хранятся места захоронений, заказы и отчёты исполнителей.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/graves/new" className="btn-secondary gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Добавить могилу
          </Link>
          <Link href="/dashboard/orders/new" className="btn-primary gap-2">
            <ClipboardList className="h-4 w-4" aria-hidden />
            Новый заказ
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card interactive-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-graphite/60">Мест захоронения</p>
          <p className="mt-3 text-4xl font-semibold text-ink">{graves.length}</p>
        </div>
        <div className="card interactive-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-graphite/60">Активных заказов</p>
          <p className="mt-3 text-4xl font-semibold text-ink">{activeOrders.length}</p>
        </div>
        <div className="card interactive-card bg-ink p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Завершено</p>
          <p className="mt-3 text-4xl font-semibold">{history.filter((order) => order.status === "COMPLETED").length}</p>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Места захоронения</h2>
          <Link href="/dashboard/graves/new" className="text-sm font-semibold text-moss">
            Добавить
          </Link>
        </div>
        {graves.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {graves.map((grave) => (
              <article key={grave.id} className="card interactive-card overflow-hidden">
                <img src={grave.photoUrl || "/sample-grave.svg"} alt="" className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold text-ink">{grave.fullName}</h3>
                  <p className="mt-2 muted">
                    {grave.city}, {grave.cemetery}
                  </p>
                  {grave.cemeteryAddress ? <p className="mt-1 muted">{grave.cemeteryAddress}</p> : null}
                  <p className="mt-1 muted">
                    Сектор/участок/квартал {grave.section || "не указан"}, ряд {grave.row || "не указан"}, место{" "}
                    {grave.place || "не указано"}
                  </p>
                  <Link href={`/dashboard/graves/${grave.id}/edit`} className="btn-secondary mt-4">
                    Редактировать
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapPinned}
            title="Места захоронения пока не добавлены"
            text="Добавьте данные о могиле, чтобы быстро оформить посещение или уборку."
            actionHref="/dashboard/graves/new"
            actionLabel="Добавить могилу"
          />
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Активные заказы</h2>
          <Link href="/dashboard/orders/new" className="text-sm font-semibold text-moss">
            Создать заказ
          </Link>
        </div>
        {activeOrders.length ? (
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="card interactive-card block p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{serviceLabels[order.serviceType]}</p>
                    <p className="muted">
                      {order.grave.fullName}, {formatDateTime(order.preferredDateTime)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={ClipboardList} title="Активных заказов нет" text="Создайте заказ на посещение, уборку или отчёт." />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-ink">История заказов</h2>
        {history.length ? (
          <div className="space-y-3">
            {history.map((order) => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="card interactive-card block p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{serviceLabels[order.serviceType]}</p>
                    <p className="muted">
                      {order.grave.fullName}, отчётов: {order.reportPhotos.length}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={Archive} title="История пока пустая" text="Завершённые и отменённые заказы появятся здесь." />
        )}
      </section>
    </section>
  );
}

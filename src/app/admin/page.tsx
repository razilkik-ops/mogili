import Link from "next/link";
import { ClipboardList, MapPinned, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { serviceLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();
  const [users, graves, orders] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { graves: true, orders: true } } } }),
    prisma.grave.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { user: true, grave: true, reportPhotos: true } }),
  ]);

  return (
    <section className="container-page py-8 sm:py-10">
      <p className="eyebrow">Админ-панель</p>
      <h1 className="display-title mt-3 text-4xl sm:text-5xl">Управление сервисом</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <Users className="h-5 w-5 text-moss" aria-hidden />
          <p className="mt-4 text-3xl font-semibold text-ink">{users.length}</p>
          <p className="muted">Пользователей</p>
        </div>
        <div className="card p-5">
          <MapPinned className="h-5 w-5 text-moss" aria-hidden />
          <p className="mt-4 text-3xl font-semibold text-ink">{graves.length}</p>
          <p className="muted">Мест захоронения</p>
        </div>
        <div className="card p-5">
          <ClipboardList className="h-5 w-5 text-moss" aria-hidden />
          <p className="mt-4 text-3xl font-semibold text-ink">{orders.length}</p>
          <p className="muted">Заказов</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-ink">Все заказы</h2>
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="card block p-5 transition hover:border-sage">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-ink">{serviceLabels[order.serviceType]}</p>
                  <p className="muted">
                    {order.user.name} - {order.grave.fullName}, {formatDateTime(order.preferredDateTime)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-ink">Пользователи</h2>
          <div className="card divide-y divide-stonewarm/70">
            {users.map((user) => (
              <div key={user.id} className="p-4">
                <p className="font-semibold text-ink">{user.name}</p>
                <p className="muted">
                  {user.email} - {user.role}, могил: {user._count.graves}, заказов: {user._count.orders}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold text-ink">Могилы</h2>
          <div className="card divide-y divide-stonewarm/70">
            {graves.map((grave) => (
              <div key={grave.id} className="p-4">
                <p className="font-semibold text-ink">{grave.fullName}</p>
                <p className="muted">
                  {grave.city}, {grave.cemetery}
                </p>
                {grave.cemeteryAddress ? <p className="muted">{grave.cemeteryAddress}</p> : null}
                <p className="muted">Владелец: {grave.user.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

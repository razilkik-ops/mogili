import { ServiceType } from "@prisma/client";
import Link from "next/link";
import { MapPinned } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { OrderForm } from "@/components/order-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams?: Promise<{ service?: string }>;
};

export default async function NewOrderPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const requestedService = query?.service;
  const defaultServiceType =
    requestedService && Object.values(ServiceType).includes(requestedService as ServiceType)
      ? requestedService
      : undefined;
  const graves = await prisma.grave.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <section className="container-page max-w-4xl py-10">
      <p className="eyebrow">Создание заказа</p>
      <h1 className="display-title mt-3 text-5xl">Выберите услугу и дату</h1>
      <p className="mt-3 muted">Оплата, Zoom API и Telegram Bot API готовы к подключению на следующем этапе.</p>
      <div className="mt-6">
        {graves.length ? (
          <OrderForm graves={graves} defaultServiceType={defaultServiceType} />
        ) : (
          <EmptyState
            icon={MapPinned}
            title="Сначала добавьте могилу"
            text="Заказ привязывается к конкретному месту захоронения."
            actionHref="/dashboard/graves/new"
            actionLabel="Добавить могилу"
          />
        )}
      </div>
      <Link href="/dashboard" className="mt-5 inline-block text-sm font-semibold text-moss">
        Вернуться в кабинет
      </Link>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus, ServiceType } from "@prisma/client";
import { statusLabels } from "@/lib/constants";
import { getOrderStages } from "@/lib/order-progress";

type OrderStagesProps = {
  orderId: string;
  serviceType: ServiceType;
  status: OrderStatus;
  communicationLink?: string | null;
};

const stageClass = {
  complete: {
    wrapper: "border-moss/20 bg-[#eef5ef]",
    marker: "border-moss bg-moss text-white",
    badge: "bg-moss/10 text-moss",
  },
  current: {
    wrapper: "border-moss/40 bg-[#f4f8f2] shadow-lift",
    marker: "border-moss bg-white text-moss",
    badge: "bg-moss text-white",
  },
  upcoming: {
    wrapper: "border-stonewarm/70 bg-white/60",
    marker: "border-stonewarm/80 bg-white text-graphite/70",
    badge: "bg-stonewarm/60 text-graphite",
  },
} as const;

export function OrderStages({ orderId, serviceType, status, communicationLink }: OrderStagesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stages = getOrderStages(serviceType, status);

  async function confirmSchedule() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/orders/${orderId}/confirm-schedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось подтвердить дату и время");
      return;
    }

    router.refresh();
  }

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Этапы заявки</h2>
          <p className="mt-1 muted">Текущий статус: {statusLabels[status]}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {stages.map((stage, index) => {
          const styles = stageClass[stage.state];
          return (
            <div key={stage.key} className={`rounded-lg border p-3 transition sm:p-4 ${styles.wrapper}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${styles.marker}`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{stage.title}</p>
                    {stage.state === "current" ? <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>Сейчас</span> : null}
                    {stage.state === "complete" ? <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>Пройден</span> : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-graphite/80">{stage.instruction}</p>
                  {stage.key === "link-added" && stage.state === "current" ? (
                    <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
                      {communicationLink ? (
                        <a className="btn-secondary" href={communicationLink} target="_blank" rel="noreferrer">
                          Открыть ссылку
                        </a>
                      ) : null}
                      <button type="button" className="btn-primary" onClick={confirmSchedule} disabled={loading || !communicationLink}>
                        {loading ? "Подтверждение..." : "Дата и время верные"}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {error ? <p className="mt-4 text-sm text-[#8a453b]">{error}</p> : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { contactOptions, reportOptions, serviceOptions } from "@/lib/constants";
import { toDateInput } from "@/lib/format";

type GraveOption = {
  id: string;
  fullName: string;
  city: string;
  cemetery: string;
};

type OrderFormProps = {
  graves: GraveOption[];
  defaultServiceType?: string;
  initial?: {
    id: string;
    graveId: string;
    serviceType: string;
    reportType: string;
    contactMethod: string;
    contactValue: string;
    preferredDate: Date | string;
    userComment?: string | null;
  };
};

export function OrderForm({ graves, defaultServiceType, initial }: OrderFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(initial ? `/api/orders/${initial.id}` : "/api/orders", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось создать заказ");
      return;
    }

    router.push(`/dashboard/orders/${payload.order.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-5 p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="label" htmlFor="graveId">
          Место захоронения
        </label>
        <select id="graveId" name="graveId" className="input" defaultValue={initial?.graveId || ""} required>
          <option value="" disabled>
            Выберите могилу
          </option>
          {graves.map((grave) => (
            <option key={grave.id} value={grave.id}>
              {grave.fullName} - {grave.city}, {grave.cemetery}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="serviceType">
          Услуга
        </label>
        <select id="serviceType" name="serviceType" className="input" defaultValue={initial?.serviceType || defaultServiceType || "ONLINE_VISIT"}>
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="reportType">
          Формат отчёта
        </label>
        <select id="reportType" name="reportType" className="input" defaultValue={initial?.reportType || "PHOTO"}>
          {reportOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="preferredDate">
          Желаемая дата
        </label>
        <input
          id="preferredDate"
          name="preferredDate"
          type="date"
          className="input"
          defaultValue={toDateInput(initial?.preferredDate)}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="contactMethod">
          Способ связи
        </label>
        <select id="contactMethod" name="contactMethod" className="input" defaultValue={initial?.contactMethod || "TELEGRAM"}>
          {contactOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="contactValue">
          Контакт
        </label>
        <input id="contactValue" name="contactValue" className="input" defaultValue={initial?.contactValue || ""} required />
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="userComment">
          Комментарий к заказу
        </label>
        <textarea id="userComment" name="userComment" rows={4} className="input" defaultValue={initial?.userComment || ""} />
      </div>
      {error ? <p className="text-sm text-[#8a453b] md:col-span-2">{error}</p> : null}
      <div className="md:col-span-2">
        <button className="btn-primary" disabled={loading || graves.length === 0}>
          {loading ? "Сохранение..." : initial ? "Обновить заказ" : "Создать заказ"}
        </button>
      </div>
    </form>
  );
}

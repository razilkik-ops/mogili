"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";
import { statusOptions } from "@/lib/constants";
import { toDateTimeInput } from "@/lib/format";

type AdminOrderFormProps = {
  order: {
    id: string;
    status: string;
    preferredDateTime: Date | string;
    adminComment?: string | null;
    communicationLink?: string | null;
    videoReportUrl?: string | null;
    reportPhotos: { imageUrl: string }[];
  };
};

export function AdminOrderForm({ order }: AdminOrderFormProps) {
  const router = useRouter();
  const [photoUrls, setPhotoUrls] = useState(order.reportPhotos.map((photo) => photo.imageUrl));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function addPhoto(url: string) {
    setPhotoUrls((current) => [...current, url]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const body = { ...Object.fromEntries(new FormData(event.currentTarget).entries()), photoUrls };
    const response = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось обновить заказ");
      return;
    }

    setMessage("Заказ обновлён");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-5 p-6 md:grid-cols-2">
      <div>
        <label className="label" htmlFor="status">
          Статус
        </label>
        <select id="status" name="status" className="input" defaultValue={order.status}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="preferredDateTime">
          Желаемые дата и время
        </label>
        <input
          id="preferredDateTime"
          name="preferredDateTime"
          type="datetime-local"
          className="input"
          defaultValue={toDateTimeInput(order.preferredDateTime)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="adminComment">
          Ответ / комментарий администратора
        </label>
        <textarea id="adminComment" name="adminComment" rows={4} className="input" defaultValue={order.adminComment || ""} />
      </div>
      <div>
        <label className="label" htmlFor="communicationLink">
          Ссылка для связи
        </label>
        <input
          id="communicationLink"
          name="communicationLink"
          className="input"
          placeholder="Zoom, Telegram, Google Meet, WhatsApp или другая ссылка"
          defaultValue={order.communicationLink || ""}
        />
      </div>
      <div>
        <label className="label" htmlFor="videoReportUrl">
          Ссылка на видеоотчёт
        </label>
        <input id="videoReportUrl" name="videoReportUrl" className="input" defaultValue={order.videoReportUrl || ""} />
      </div>
      <div className="md:col-span-2">
        <ImageUpload onChange={addPhoto} label="Добавить фотоотчёт" />
        {photoUrls.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {photoUrls.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="h-32 w-full rounded-md border border-stonewarm object-cover" />
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-[#8a453b]"
                  onClick={() => setPhotoUrls((current) => current.filter((item) => item !== url))}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {error ? <p className="text-sm text-[#8a453b] md:col-span-2">{error}</p> : null}
      {message ? <p className="text-sm text-moss md:col-span-2">{message}</p> : null}
      <div className="md:col-span-2">
        <button className="btn-primary" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>
    </form>
  );
}

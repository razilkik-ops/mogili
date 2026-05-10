"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";
import { toDateInput } from "@/lib/format";

type GraveFormProps = {
  initial?: {
    id: string;
    fullName: string;
    birthDate?: string | Date | null;
    deathDate?: string | Date | null;
    city: string;
    cemetery: string;
    cemeteryAddress?: string | null;
    section?: string | null;
    row?: string | null;
    place?: string | null;
    description?: string | null;
    photoUrl?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
};

export function GraveForm({ initial }: GraveFormProps) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const body = { ...Object.fromEntries(formData.entries()), photoUrl };
    const response = await fetch(initial ? `/api/graves/${initial.id}` : "/api/graves", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось сохранить");
      return;
    }

    setMessage("Данные сохранены");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-5 p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="label" htmlFor="fullName">
          ФИО усопшего
        </label>
        <input id="fullName" name="fullName" className="input" defaultValue={initial?.fullName} required />
      </div>
      <div>
        <label className="label" htmlFor="birthDate">
          Дата рождения
        </label>
        <input id="birthDate" name="birthDate" type="date" className="input" defaultValue={toDateInput(initial?.birthDate)} />
      </div>
      <div>
        <label className="label" htmlFor="deathDate">
          Дата смерти
        </label>
        <input id="deathDate" name="deathDate" type="date" className="input" defaultValue={toDateInput(initial?.deathDate)} />
      </div>
      <div>
        <label className="label" htmlFor="city">
          Город
        </label>
        <input id="city" name="city" className="input" defaultValue={initial?.city} required />
      </div>
      <div>
        <label className="label" htmlFor="cemetery">
          Название кладбища
        </label>
        <input id="cemetery" name="cemetery" className="input" defaultValue={initial?.cemetery} required />
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="cemeteryAddress">
          Адрес кладбища, если известен
        </label>
        <input id="cemeteryAddress" name="cemeteryAddress" className="input" defaultValue={initial?.cemeteryAddress || ""} />
      </div>
      <div>
        <label className="label" htmlFor="section">
          Сектор / участок / квартал, если есть
        </label>
        <input id="section" name="section" className="input" defaultValue={initial?.section || ""} />
      </div>
      <div>
        <label className="label" htmlFor="row">
          Ряд, если есть
        </label>
        <input id="row" name="row" className="input" defaultValue={initial?.row || ""} />
      </div>
      <div>
        <label className="label" htmlFor="place">
          Место, если есть
        </label>
        <input id="place" name="place" className="input" defaultValue={initial?.place || ""} />
      </div>
      <div>
        <label className="label" htmlFor="latitude">
          Геолокация, широта
        </label>
        <input id="latitude" name="latitude" className="input" defaultValue={initial?.latitude || ""} />
      </div>
      <div>
        <label className="label" htmlFor="longitude">
          Геолокация, долгота
        </label>
        <input id="longitude" name="longitude" className="input" defaultValue={initial?.longitude || ""} />
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="description">
          Ориентиры и комментарий
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="input"
          placeholder="Например: рядом с высокой елью, светлая ограда, справа от семейного захоронения."
          defaultValue={initial?.description || ""}
        />
        <p className="mt-2 text-xs leading-5 text-graphite/70">
          Нумерация не обязательна: для поиска используем город, название и адрес кладбища, сектор/участок/квартал,
          ряд, место, ориентиры, фото и GPS-координаты.
        </p>
      </div>
      <div className="md:col-span-2">
        <ImageUpload value={photoUrl} onChange={setPhotoUrl} onRemove={() => setPhotoUrl("")} label="Фото могилы" />
      </div>
      {error ? <p className="text-sm text-[#8a453b] md:col-span-2">{error}</p> : null}
      {message ? <p className="text-sm text-moss md:col-span-2">{message}</p> : null}
      <div className="md:col-span-2">
        <button className="btn-primary" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";

type ImageUploadProps = {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUpload({ value, onChange, label = "Загрузить изображение" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось загрузить файл");
      return;
    }

    onChange(payload.url);
  }

  return (
    <div>
      <label className="label">{label}</label>
      <label className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-stonewarm bg-white/70 px-4 py-5 text-center text-sm text-graphite hover:border-sage">
        <ImagePlus className="mb-2 h-6 w-6 text-moss" aria-hidden />
        <span>{loading ? "Загрузка..." : "Выберите файл"}</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </label>
      {value ? (
        <img src={value} alt="" className="mt-3 h-40 w-full rounded-md border border-stonewarm object-cover" />
      ) : null}
      {error ? <p className="mt-2 text-sm text-[#8a453b]">{error}</p> : null}
    </div>
  );
}

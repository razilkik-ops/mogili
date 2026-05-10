"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ImageUploadProps = {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
};

export function ImageUpload({ value, onChange, onRemove, label = "Загрузить изображение" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setPreviewUrl(value || "");
    }
  }, [loading, value]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  async function upload(file: File) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = URL.createObjectURL(file);
    setPreviewUrl(objectUrlRef.current);
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

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPreviewUrl(payload.url);
    onChange(payload.url);
  }

  function removeImage() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPreviewUrl("");
    setError("");
    onRemove?.();
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
      {previewUrl ? (
        <div className="mt-3 overflow-hidden rounded-md border border-stonewarm bg-white/80">
          <img src={previewUrl} alt="Предпросмотр фотографии" className="h-48 w-full object-cover" />
          <div className="flex flex-col gap-3 border-t border-stonewarm/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-semibold text-graphite/75">
              <span>{loading ? "Загружаем фотографию..." : "Фото готово к сохранению"}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-graphite/75">{loading ? "Предпросмотр" : "Загружено"}</span>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-stonewarm/80 px-3 py-2 text-xs font-semibold text-[#8a453b] transition hover:bg-[#f4e7e2]"
                onClick={removeImage}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Удалить
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {error ? <p className="mt-2 text-sm text-[#8a453b]">{error}</p> : null}
    </div>
  );
}

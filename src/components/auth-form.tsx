"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Проверьте данные");
      return;
    }

    router.push(searchParams.get("next") || (payload.user?.role === "admin" ? "/admin" : "/dashboard"));
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6">
      {mode === "register" ? (
        <div>
          <label className="label" htmlFor="name">
            Имя
          </label>
          <input id="name" name="name" className="input" autoComplete="name" required />
        </div>
      ) : null}
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={mode === "register" ? 8 : undefined}
          className="input"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          required
        />
      </div>
      {error ? <p className="rounded-md bg-[#ead8d2] px-3 py-2 text-sm text-[#7a4036]">{error}</p> : null}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Подождите..." : mode === "register" ? "Создать кабинет" : "Войти"}
      </button>
    </form>
  );
}

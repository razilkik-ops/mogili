"use client";

import { useState } from "react";

export function ContactForm() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSent(false);
    setLoading(true);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось отправить сообщение");
      return;
    }

    event.currentTarget.reset();
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-4 sm:p-6">
      <div>
        <label className="label" htmlFor="name">
          Имя
        </label>
        <input id="name" name="name" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Телефон
        </label>
        <input id="phone" name="phone" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="message">
          Сообщение
        </label>
        <textarea id="message" name="message" rows={5} className="input" required />
      </div>
      {error ? <p className="text-sm text-[#8a453b]">{error}</p> : null}
      {sent ? <p className="text-sm text-moss">Сообщение отправлено. Мы ответим бережно и по делу.</p> : null}
      <button className="btn-primary" disabled={loading}>
        {loading ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

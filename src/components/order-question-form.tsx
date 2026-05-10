"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderQuestionFormProps = {
  orderId: string;
  initialQuestion?: string | null;
  disabled?: boolean;
};

export function OrderQuestionForm({ orderId, initialQuestion, disabled = false }: OrderQuestionFormProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialQuestion || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch(`/api/orders/${orderId}/question`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerQuestion: question }),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось отправить вопрос");
      return;
    }

    setMessage(question.trim() ? "Вопрос отправлен администратору" : "Вопрос удалён");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Вопрос администратору</h2>
          <p className="mt-1 muted">Уточните детали по этой заявке. Ответ администратор может оставить в комментарии к заказу.</p>
        </div>
      </div>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={4}
        className="input mt-4"
        placeholder="Например: можно ли перенести время, когда появится ссылка для связи или что будет в отчёте?"
        disabled={disabled || loading}
      />
      {disabled ? <p className="mt-3 text-sm text-graphite/75">Для отменённой заявки новые вопросы отправлять нельзя.</p> : null}
      {error ? <p className="mt-3 text-sm text-[#8a453b]">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-moss">{message}</p> : null}
      <div className="mt-4 flex justify-end">
        <button className="btn-primary" disabled={disabled || loading}>
          {loading ? "Отправка..." : question.trim() ? "Обновить вопрос" : "Отправить вопрос"}
        </button>
      </div>
    </form>
  );
}

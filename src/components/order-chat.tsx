"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { formatDateTime } from "@/lib/format";

type ChatMessage = {
  id: string;
  body: string;
  createdAt: Date | string;
  senderRole: Role;
  author?: {
    name: string;
  } | null;
};

type OrderChatProps = {
  orderId: string;
  currentRole: Role;
  messages: ChatMessage[];
  disabled?: boolean;
};

export function OrderChat({ orderId, currentRole, messages, disabled = false }: OrderChatProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const endpoint = currentRole === "admin" ? `/api/admin/orders/${orderId}/messages` : `/api/orders/${orderId}/messages`;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Не удалось отправить сообщение");
      return;
    }

    setBody("");
    setMessage("Сообщение отправлено");
    router.refresh();
  }

  return (
    <div className="card p-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">Чат по заявке</h2>
        <p className="mt-1 muted">
          {currentRole === "admin"
            ? "Здесь можно отвечать клиенту по этой заявке и уточнять детали прямо в переписке."
            : "Задавайте вопросы по этой заявке и получайте ответы администратора в этом же окне."}
        </p>
      </div>

      <div className="mt-5 max-h-[26rem] space-y-3 overflow-y-auto rounded-lg border border-stonewarm/70 bg-[#fbf8f1]/70 p-4">
        {messages.length ? (
          messages.map((chatMessage) => {
            const isOwn = chatMessage.senderRole === currentRole;
            return (
              <div key={chatMessage.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    isOwn ? "bg-moss text-white" : "border border-stonewarm/70 bg-white text-ink"
                  }`}
                >
                  <div className={`text-xs font-semibold ${isOwn ? "text-white/80" : "text-moss"}`}>
                    {chatMessage.author?.name || (chatMessage.senderRole === "admin" ? "Администратор" : "Вы")}
                  </div>
                  <p className={`mt-1 whitespace-pre-wrap text-sm leading-6 ${isOwn ? "text-white" : "text-graphite/90"}`}>{chatMessage.body}</p>
                  <p className={`mt-2 text-xs ${isOwn ? "text-white/75" : "text-graphite/60"}`}>{formatDateTime(chatMessage.createdAt)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="muted">Переписка пока пустая. Первое сообщение можно отправить ниже.</p>
        )}
      </div>

      <form onSubmit={submit} className="mt-5">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          className="input"
          placeholder={currentRole === "admin" ? "Напишите ответ клиенту..." : "Напишите сообщение администратору..."}
          disabled={disabled || loading}
        />
        {disabled ? <p className="mt-3 text-sm text-graphite/75">Для отменённой заявки чат недоступен.</p> : null}
        {error ? <p className="mt-3 text-sm text-[#8a453b]">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-moss">{message}</p> : null}
        <div className="mt-4 flex justify-end">
          <button className="btn-primary" disabled={disabled || loading}>
            {loading ? "Отправка..." : "Отправить сообщение"}
          </button>
        </div>
      </form>
    </div>
  );
}

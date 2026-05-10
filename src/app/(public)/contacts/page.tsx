import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export default function ContactsPage() {
  return (
    <section className="container-page grid gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="min-w-0">
        <p className="eyebrow">Контакты</p>
        <h1 className="display-title mt-4 text-4xl sm:text-7xl">Свяжитесь с нами</h1>
        <p className="mt-5 text-base leading-7 text-graphite/80 sm:text-lg sm:leading-8">
          Мы работаем деликатно и с уважением: уточняем детали, не торопим с решениями и ведём заказ
          прозрачно до завершения.
        </p>

        <div className="mt-8 space-y-4">
          <div className="card interactive-card flex items-center gap-4 p-4 sm:p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-mist text-moss">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-ink">Telegram / WhatsApp</p>
              <p className="muted">@quiet_visit, +375 29 000-00-00</p>
            </div>
          </div>
          <div className="card interactive-card flex items-center gap-4 p-4 sm:p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-mist text-moss">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-ink">Email</p>
              <p className="muted">hello@memorial.local</p>
            </div>
          </div>
          <div className="card interactive-card flex items-center gap-4 p-4 sm:p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-mist text-moss">
              <Phone className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-ink">Телефон</p>
              <p className="muted">+375 17 000-00-00</p>
            </div>
          </div>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}

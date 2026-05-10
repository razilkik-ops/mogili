import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Camera,
  HeartHandshake,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { servicePages } from "@/lib/service-content";

const steps = [
  "Вы добавляете место захоронения.",
  "Выбираете услугу и удобную дату.",
  "Мы посещаем могилу и выполняем задачу.",
  "Вы получаете фото, видео или видеосвязь.",
];

const benefits = [
  { icon: ShieldCheck, title: "Ответственный процесс", text: "Каждый заказ имеет статус, комментарии и понятную историю." },
  { icon: HeartHandshake, title: "Деликатный подход", text: "Без громких обещаний и давления. Только спокойная помощь на расстоянии." },
  { icon: Camera, title: "Прозрачные отчёты", text: "Фото, видео, ссылки и комментарии исполнителя доступны в кабинете." },
];

const faq = [
  {
    q: "Можно ли заказать видеозвонок с места?",
    a: "Да. В заказе можно выбрать Zoom, Telegram или другой удобный способ связи.",
  },
  {
    q: "Что если точное место неизвестно?",
    a: "Добавьте город, название кладбища, адрес, сектор/участок/квартал, ориентиры, фото или GPS. Нумерация не обязательна.",
  },
  {
    q: "Как подключить оплату?",
    a: "В проекте оставлена чистая структура для будущего платёжного провайдера.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-soft-grid bg-[size:42px_42px] opacity-55" />
        <div className="container-page grid min-h-[calc(100vh-4.75rem)] items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-stonewarm/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-moss shadow-sm backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-clay" />
              Memorial Visit
            </div>
            <h1 className="display-title mt-7 max-w-4xl text-6xl sm:text-7xl lg:text-8xl">
            Тихое посещение
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-graphite/80">
            Сервис онлайн-посещения могил, ухода за местами захоронения и бережных фото- или
            видеоотчётов для тех, кто не может приехать лично.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/orders/new" className="btn-primary gap-2">
              Заказать посещение
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/login" className="btn-secondary">
              Войти в кабинет
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["24/7", "заявки онлайн"],
                ["3", "формата отчёта"],
                ["7", "статусов заказа"],
              ].map(([value, label]) => (
                <div key={label} className="panel px-4 py-3">
                  <p className="text-2xl font-semibold text-ink">{value}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite/65">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="panel relative overflow-hidden p-4">
              <div className="absolute left-6 top-6 z-10 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
                live care
              </div>
              <img src="/sample-report-1.svg" alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
              <div className="absolute bottom-8 left-8 right-8 rounded-lg border border-white/70 bg-white/90 p-5 shadow-lift backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-mist text-moss">
                    <CalendarCheck className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">Запланировано посещение</p>
                    <p className="mt-1 muted">Статус, отчёт и комментарий доступны в личном кабинете.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-3 top-16 hidden w-52 rounded-lg border border-white/70 bg-ink p-4 text-white shadow-lift lg:block">
              <Video className="h-5 w-5 text-[#d8c3a5]" aria-hidden />
              <p className="mt-3 text-sm font-semibold">Zoom / Telegram</p>
              <p className="mt-1 text-xs leading-5 text-white/70">Ссылка на звонок хранится в заказе.</p>
            </div>
            <div className="absolute -left-5 bottom-14 hidden w-56 rounded-lg border border-white/70 bg-white/90 p-4 shadow-lift backdrop-blur-xl lg:block">
              <MapPinned className="h-5 w-5 text-clay" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-ink">Точные ориентиры</p>
              <p className="mt-1 text-xs leading-5 text-graphite/70">Адрес, участок, ориентиры, фото и GPS.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page section-shell p-5 sm:p-8">
          <p className="eyebrow">Как это работает</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="card interactive-card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="mt-5 font-medium leading-7 text-ink">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Услуги</p>
            <h2 className="display-title mt-3 text-5xl">Помощь на расстоянии</h2>
          </div>
          <Link href="/services" className="btn-secondary gap-2">
            Все услуги
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {servicePages.map((service, index) => (
            <Link
              key={service.serviceType}
              href={`/services/${service.slug}`}
              className={`card interactive-card block p-6 ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-mist text-moss">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{service.title}</h3>
              <p className="mt-3 muted">{service.lead}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-moss">
                Подробнее
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8c3a5]">Доверие</p>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-none">Спокойная организация без лишнего шума</h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              Сервис хранит адреса захоронений, заказы, статусы и отчёты в личном кабинете. Администратор
              видит полную картину и может аккуратно вести заказ до завершения.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
                <item.icon className="h-6 w-6 text-[#d8c3a5]" aria-hidden />
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-16 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <div className="mt-6 space-y-4">
            {faq.map((item) => (
              <details key={item.q} className="card interactive-card p-5">
                <summary className="cursor-pointer font-semibold text-ink">{item.q}</summary>
                <p className="mt-3 muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Контакты</p>
          <h2 className="display-title mt-3 text-5xl">Напишите нам</h2>
          <p className="mt-4 muted">Ответим спокойно, уточним детали и подскажем, как оформить первое посещение.</p>
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-stonewarm/80 bg-white/65 p-4 text-sm font-semibold text-ink">
            <MessageCircle className="h-5 w-5 text-moss" aria-hidden />
            Telegram, WhatsApp, телефон или email
          </div>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, Camera, ClipboardCheck, MapPinned, Sparkles, Video } from "lucide-react";
import { reportOptions } from "@/lib/constants";
import { servicePages } from "@/lib/service-content";

const icons = [MapPinned, ClipboardCheck, Camera, Video, Sparkles];

export default function ServicesPage() {
  return (
    <section className="container-page py-8 sm:py-12">
      <div className="section-shell overflow-hidden p-4 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">Услуги</p>
            <h1 className="display-title mt-4 text-4xl sm:text-7xl">Онлайн-посещение, уход и отчёты</h1>
            <p className="mt-5 text-base leading-7 text-graphite/80 sm:mt-6 sm:text-lg sm:leading-8">
              Выберите услугу, формат отчёта и удобный способ связи. Подключение Zoom API и Telegram Bot API
              подготовлено как следующий этап интеграций.
            </p>
          </div>
          <div className="rounded-lg bg-ink p-4 text-white shadow-lift sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8c3a5]">Форматы</p>
            <div className="mt-5 grid gap-3">
              {reportOptions.map((option) => (
                <div key={option.value} className="flex items-center justify-between rounded-md bg-white/10 px-4 py-3">
                  <span className="font-semibold">{option.label}</span>
                  <span className="h-2 w-2 rounded-full bg-[#d8c3a5]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {servicePages.map((service, index) => {
          const Icon = icons[index];
          return (
            <Link
              key={service.serviceType}
              href={`/services/${service.slug}`}
              className={`card interactive-card block p-4 sm:p-6 ${index === 0 ? "lg:col-span-2" : ""}`}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-mist text-moss">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h2 className="mt-5 text-2xl font-semibold text-ink">{service.title}</h2>
                  <p className="mt-3 max-w-2xl muted">{service.lead}</p>
                </div>
                <span className="btn-primary shrink-0 gap-2">
                  Подробнее
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]">
                <div className="rounded-md border border-stonewarm/80 bg-linen/80 p-4">
                  <p className="text-sm font-semibold text-ink">Состав работ</p>
                  <p className="mt-2 muted">{service.shortWork}</p>
                </div>
                <div className="rounded-md border border-stonewarm/80 bg-white/70 p-4">
                  <p className="text-sm font-semibold text-ink">Доступный отчёт</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reportOptions.map((option) => (
                      <span key={option.value} className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-moss">
                        {option.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

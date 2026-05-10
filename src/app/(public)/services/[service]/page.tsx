import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, ClipboardList, FileText } from "lucide-react";
import { getServiceBySlug, servicePages } from "@/lib/service-content";

type PageProps = {
  params: Promise<{ service: string }>;
};

export function generateStaticParams() {
  return servicePages.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Услуга не найдена" };
  }

  return {
    title: `${service.title} - Тихое посещение`,
    description: service.lead,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <section className="container-page py-12">
      <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-moss hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Все услуги
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <div className="section-shell p-6 sm:p-10">
          <p className="eyebrow">Подробно об услуге</p>
          <h1 className="display-title mt-4 text-6xl sm:text-7xl">{service.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-graphite/80">{service.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/dashboard/orders/new?service=${service.serviceType}`} className="btn-primary gap-2">
              Заказать услугу
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/contacts" className="btn-secondary">
              Задать вопрос
            </Link>
          </div>
        </div>

        <aside className="card p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Кратко</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-md bg-mist p-4">
              <CalendarCheck className="h-5 w-5 text-moss" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-ink">Время</p>
              <p className="mt-1 muted">{service.duration}</p>
            </div>
            <div className="rounded-md bg-linen p-4">
              <FileText className="h-5 w-5 text-clay" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-ink">Отчёт</p>
              <p className="mt-1 muted">{service.report}</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.62fr_0.38fr]">
        <section className="card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-white">
              <ClipboardList className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="eyebrow">Этапы</p>
              <h2 className="text-2xl font-semibold text-ink">Как проходит услуга</h2>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {service.stages.map((stage, index) => (
              <div key={stage} className="grid gap-4 rounded-lg border border-stonewarm/80 bg-white/65 p-4 sm:grid-cols-[3rem_1fr]">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-mist text-sm font-bold text-moss">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-6 text-graphite">{stage}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-6">
            <p className="eyebrow">Что входит</p>
            <div className="mt-5 space-y-3">
              {service.included.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-moss" aria-hidden />
                  <p className="text-sm leading-6 text-graphite">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-ink p-6 text-white shadow-lift">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d8c3a5]">Результат</p>
            <p className="mt-4 text-lg font-semibold leading-7">{service.outcome}</p>
            <Link href={`/dashboard/orders/new?service=${service.serviceType}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#d8c3a5]">
              Перейти к заказу
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </div>
      </div>
    </section>
  );
}

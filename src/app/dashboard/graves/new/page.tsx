import { GraveForm } from "@/components/grave-form";
import { requireUser } from "@/lib/auth";

export default async function NewGravePage() {
  await requireUser();

  return (
    <section className="container-page max-w-4xl py-10">
      <p className="eyebrow">Добавление могилы</p>
      <h1 className="display-title mt-3 text-5xl">Данные места захоронения</h1>
      <p className="mt-3 muted">
        Укажите всё, что поможет исполнителю найти место: город, кладбище, адрес, сектор или участок, ориентиры, фото и GPS.
        Поля с нумерацией можно оставить пустыми.
      </p>
      <div className="mt-6">
        <GraveForm />
      </div>
    </section>
  );
}

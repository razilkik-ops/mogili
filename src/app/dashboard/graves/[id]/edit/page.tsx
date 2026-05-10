import { notFound } from "next/navigation";
import { GraveForm } from "@/components/grave-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditGravePage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const grave = await prisma.grave.findFirst({ where: { id, userId: user.id } });
  if (!grave) notFound();

  return (
    <section className="container-page max-w-4xl py-8 sm:py-10">
      <p className="eyebrow">Редактирование</p>
      <h1 className="display-title mt-3 text-4xl sm:text-5xl">{grave.fullName}</h1>
      <div className="mt-6">
        <GraveForm initial={grave} />
      </div>
    </section>
  );
}

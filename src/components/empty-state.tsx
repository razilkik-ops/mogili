import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ icon: Icon, title, text, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-linen p-4 text-moss">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-graphite/75">{text}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

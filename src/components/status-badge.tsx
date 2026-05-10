import type { OrderStatus } from "@prisma/client";
import { statusLabels } from "@/lib/constants";

const statusClass: Record<OrderStatus, string> = {
  NEW: "bg-stonewarm text-ink",
  AWAITING_COMMUNICATION_LINK: "bg-[#efe3d7] text-[#8a5c3a]",
  COMMUNICATION_LINK_ADDED: "bg-[#dce9e1] text-moss",
  SCHEDULED: "bg-[#e7e0d6] text-graphite",
  IN_PROGRESS: "bg-[#d8ddcf] text-moss",
  REPORT_UPLOADED: "bg-[#e9eddc] text-ink",
  COMPLETED: "bg-[#d4dfd2] text-moss",
  CANCELED: "bg-[#ead8d2] text-[#7a4036]",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

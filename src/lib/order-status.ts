import type { OrderStatus, ServiceType } from "@prisma/client";

export function resolveDraftOrderStatus(serviceType: ServiceType, currentStatus?: OrderStatus): OrderStatus {
  if (serviceType === "LIVE_CALL") {
    return currentStatus === "COMMUNICATION_LINK_ADDED" ? "COMMUNICATION_LINK_ADDED" : "AWAITING_COMMUNICATION_LINK";
  }

  return "NEW";
}

import type { OrderStatus, ServiceType } from "@prisma/client";

export type OrderStage = {
  key: string;
  title: string;
  instruction: string;
  statuses: OrderStatus[];
};

export type OrderStageState = "complete" | "current" | "upcoming";

const commonStages: OrderStage[] = [
  {
    key: "new",
    title: "Заявка создана",
    instruction: "Мы получили заявку. Администратор видит детали заказа и готовит следующий шаг.",
    statuses: ["NEW"],
  },
  {
    key: "scheduled",
    title: "Дата подтверждена",
    instruction: "Ориентируйтесь на дату и время в заявке. Если что-то изменилось, можно написать админу ниже.",
    statuses: ["SCHEDULED"],
  },
  {
    key: "in-progress",
    title: "Заявка в работе",
    instruction: "Сейчас выполняется посещение, уборка, съёмка или созвон по вашему заказу.",
    statuses: ["IN_PROGRESS"],
  },
  {
    key: "report-uploaded",
    title: "Отчёт загружен",
    instruction: "Материалы уже добавлены в заявку. Можно открыть фото, видео или ссылку прямо на этой странице.",
    statuses: ["REPORT_UPLOADED"],
  },
  {
    key: "completed",
    title: "Заявка завершена",
    instruction: "Работа завершена. Если останутся вопросы по результату, их тоже можно задать админу.",
    statuses: ["COMPLETED"],
  },
];

const liveCallStages: OrderStage[] = [
  {
    key: "awaiting-link",
    title: "Ожидаем ссылку для связи",
    instruction: "Администратор подготовит ссылку на звонок и добавит её в блок с отчётами и ссылками.",
    statuses: ["AWAITING_COMMUNICATION_LINK"],
  },
  {
    key: "link-added",
    title: "Ссылка для связи готова",
    instruction: "Проверьте блок с отчётами и ссылками. Перед созвоном откройте ссылку и убедитесь, что всё работает.",
    statuses: ["COMMUNICATION_LINK_ADDED"],
  },
];

const canceledStage: OrderStage = {
  key: "canceled",
  title: "Заявка отменена",
  instruction: "Этот заказ больше не выполняется. При необходимости можно оформить новую заявку.",
  statuses: ["CANCELED"],
};

export function getOrderStages(serviceType: ServiceType, status: OrderStatus) {
  const stages = [...commonStages];

  if (serviceType === "LIVE_CALL") {
    stages.splice(1, 0, ...liveCallStages);
  }

  if (status === "CANCELED") {
    stages.push(canceledStage);
  }

  const currentIndex = stages.findIndex((stage) => stage.statuses.includes(status));

  return stages.map((stage, index) => ({
    ...stage,
    state: (currentIndex === -1 ? "upcoming" : index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming") as OrderStageState,
  }));
}

import type { ContactMethod, OrderStatus, ReportType, ServiceType } from "@prisma/client";

export const serviceLabels: Record<ServiceType, string> = {
  ONLINE_VISIT: "Онлайн-посещение могилы",
  CLEANING: "Уборка могилы",
  PHOTO_REPORT: "Фотоотчёт",
  VIDEO_REPORT: "Видеоотчёт",
  LIVE_CALL: "Видеосвязь во время посещения",
};

export const serviceDescriptions: Record<ServiceType, string> = {
  ONLINE_VISIT: "Администратор ведёт заказ, организует посещение места и загружает результат в личный кабинет.",
  CLEANING: "Аккуратная базовая уборка участка, удаление мусора, протирка памятника и уход за местом.",
  PHOTO_REPORT: "Серия фотографий после посещения или уборки с комментарием администратора.",
  VIDEO_REPORT: "Короткое видео с места захоронения и спокойным обзором выполненных работ.",
  LIVE_CALL: "Видеосвязь через Zoom, Telegram, Google Meet, WhatsApp или другой согласованный канал.",
};

export const reportLabels: Record<ReportType, string> = {
  PHOTO: "Фото",
  VIDEO: "Видео",
  LIVE_CALL: "Видеозвонок",
};

export const contactLabels: Record<ContactMethod, string> = {
  TELEGRAM: "Telegram",
  WHATSAPP: "WhatsApp",
  ZOOM: "Zoom",
  PHONE: "Телефон",
  EMAIL: "Email",
};

export const statusLabels: Record<OrderStatus, string> = {
  NEW: "Новый",
  AWAITING_COMMUNICATION_LINK: "Ожидаем ссылки для связи",
  COMMUNICATION_LINK_ADDED: "Ссылка для связи добавлена",
  SCHEDULED: "Запланирован",
  IN_PROGRESS: "Выполняется",
  REPORT_UPLOADED: "Отчёт загружен",
  COMPLETED: "Завершён",
  CANCELED: "Отменён",
};

export const serviceOptions = Object.entries(serviceLabels).map(([value, label]) => ({ value, label }));
export const reportOptions = Object.entries(reportLabels).map(([value, label]) => ({ value, label }));
export const contactOptions = Object.entries(contactLabels).map(([value, label]) => ({ value, label }));
export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));

import { ContactMethod, ReportType, ServiceType } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Укажите имя"),
  email: z.email("Укажите корректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

export const loginSchema = z.object({
  email: z.email("Укажите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

const optionalText = z.string().trim().optional().or(z.literal(""));

export const graveSchema = z.object({
  fullName: z.string().trim().min(3, "Укажите ФИО"),
  birthDate: optionalText,
  deathDate: optionalText,
  city: z.string().trim().min(2, "Укажите город"),
  cemetery: z.string().trim().min(2, "Укажите кладбище"),
  cemeteryAddress: optionalText,
  section: optionalText,
  row: optionalText,
  place: optionalText,
  description: optionalText,
  photoUrl: optionalText,
  latitude: optionalText,
  longitude: optionalText,
});

export const orderSchema = z.object({
  graveId: z.string().min(1, "Выберите могилу"),
  serviceType: z.enum(ServiceType),
  reportType: z.enum(ReportType),
  contactMethod: z.enum(ContactMethod),
  contactValue: z.string().trim().min(2, "Укажите контакт"),
  preferredDateTime: z.string().min(1, "Выберите дату и время"),
  userComment: optionalText,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя"),
  email: z.email("Укажите корректный email"),
  phone: optionalText,
  message: z.string().trim().min(10, "Напишите сообщение подробнее"),
});

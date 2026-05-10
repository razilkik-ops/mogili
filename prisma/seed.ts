import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.reportPhoto.deleteMany();
  await prisma.order.deleteMany();
  await prisma.grave.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.user.deleteMany();

  const [admin, user] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Администратор",
        email: "admin@memorial.local",
        passwordHash: await bcrypt.hash("Admin12345", 12),
        role: "admin",
      },
    }),
    prisma.user.create({
      data: {
        name: "Анна Сергеева",
        email: "user@memorial.local",
        passwordHash: await bcrypt.hash("User12345", 12),
        role: "user",
      },
    }),
  ]);

  const [graveOne, graveTwo] = await Promise.all([
    prisma.grave.create({
      data: {
        userId: user.id,
        fullName: "Сергей Иванович Сергеев",
        birthDate: new Date("1948-04-12"),
        deathDate: new Date("2018-09-03"),
        city: "Минск",
        cemetery: "Северное кладбище",
        cemeteryAddress: "Минский район, район д. Якубовичи",
        section: "12",
        row: "4",
        place: "18",
        description: "Ориентир: рядом с высокой елью, серый гранитный памятник.",
        photoUrl: "/sample-grave.svg",
        latitude: 53.9856,
        longitude: 27.5698,
      },
    }),
    prisma.grave.create({
      data: {
        userId: user.id,
        fullName: "Мария Петровна Сергеева",
        birthDate: new Date("1951-07-22"),
        deathDate: new Date("2021-02-15"),
        city: "Минск",
        cemetery: "Восточное кладбище",
        cemeteryAddress: "Минск, ул. Козлова",
        section: "7",
        row: "2",
        place: "9",
        description: "Семейное захоронение, светлая ограда.",
        photoUrl: "/sample-grave.svg",
      },
    }),
  ]);

  const orderOne = await prisma.order.create({
    data: {
      userId: user.id,
      graveId: graveOne.id,
      serviceType: "CLEANING",
      reportType: "PHOTO",
      contactMethod: "TELEGRAM",
      contactValue: "@anna_memorial",
      preferredDateTime: new Date("2026-05-18T09:00:00+03:00"),
      status: "SCHEDULED",
      userComment: "Пожалуйста, уберите сухие листья и проверьте вазу.",
      adminComment: "Назначен исполнитель, посещение запланировано на утро.",
    },
  });

  await prisma.reportPhoto.createMany({
    data: [
      { orderId: orderOne.id, imageUrl: "/sample-report-1.svg" },
      { orderId: orderOne.id, imageUrl: "/sample-report-2.svg" },
    ],
  });

  await prisma.order.createMany({
    data: [
      {
        userId: user.id,
        graveId: graveTwo.id,
        serviceType: "LIVE_CALL",
        reportType: "LIVE_CALL",
        contactMethod: "ZOOM",
        contactValue: "anna@example.com",
        preferredDateTime: new Date("2026-05-22T17:00:00+03:00"),
        status: "COMMUNICATION_LINK_ADDED",
        userComment: "Нужен видеозвонок около 17:00.",
        communicationLink: "https://zoom.us/j/0000000000",
      },
      {
        userId: user.id,
        graveId: graveOne.id,
        serviceType: "VIDEO_REPORT",
        reportType: "VIDEO",
        contactMethod: "EMAIL",
        contactValue: "user@memorial.local",
        preferredDateTime: new Date("2026-04-28T15:30:00+03:00"),
        status: "COMPLETED",
        userComment: "Короткое видео после посещения.",
        adminComment: "Видеоотчёт загружен, место в порядке.",
        videoReportUrl: "https://example.com/video-report",
      },
    ],
  });

  await prisma.contactRequest.create({
    data: {
      name: "Ирина",
      email: "irina@example.com",
      phone: "+375 29 000-00-00",
      message: "Подскажите, работаете ли вы с кладбищами в Минской области?",
    },
  });

  console.log({ admin: admin.email, user: user.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

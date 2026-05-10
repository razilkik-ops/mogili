# Тихое посещение

Полный проект сервиса онлайн-посещения могил: Next.js, React, Tailwind CSS, Node.js API Routes, PostgreSQL и Prisma.

## Стек

- Next.js App Router + TypeScript
- Tailwind CSS
- Node.js API Routes
- PostgreSQL
- Prisma ORM
- JWT-сессии в httpOnly cookie
- Роли `user` и `admin`

## Быстрый запуск

1. Установите зависимости:

```bash
npm install
```

2. Создайте `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

3. Запустите PostgreSQL:

```bash
docker compose up -d
```

4. Примените миграцию и seed:

```bash
npm run prisma:migrate -- --name init
npm run db:seed
```

5. Запустите проект:

```bash
npm run dev
```

Сайт откроется на `http://localhost:3000`.

## Тестовые аккаунты

- Администратор: `admin@memorial.local` / `Admin12345`
- Пользователь: `user@memorial.local` / `User12345`

## Переменные окружения

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/memorial_visit?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ZOOM_CLIENT_ID=""
ZOOM_CLIENT_SECRET=""
TELEGRAM_BOT_TOKEN=""
PAYMENT_PROVIDER_SECRET=""
SMS_PROVIDER_TOKEN=""
```

## Что реализовано

- Главная страница, услуги, контакты, FAQ.
- Регистрация, вход, выход, личный кабинет.
- Роли `user` и `admin`.
- CRUD для мест захоронений через API.
- Создание, просмотр, изменение доступных заказов и отмена заказов через API.
- Админ-панель `/admin`.
- Просмотр пользователей, могил и заказов администратором.
- Обновление статуса заказа, комментариев, даты выполнения, ссылок Zoom/Telegram/видео.
- Загрузка изображений для могил и фотоотчётов в `UPLOAD_DIR` с отдачей через `/api/files/...`.
- Фотоотчёты, видеоотчёты и ссылки на звонки на странице заказа.
- Валидация форм через Zod.
- Seed-данные с пользователем, администратором, могилами и заказами.
- Адаптивный спокойный интерфейс в строгой приглушённой палитре.

## Будущие подключения

- Оплата: добавить провайдера в отдельный модуль и связать оплату с заказом.
- Zoom API: заменить ручное поле `zoomLink` на создание встречи через OAuth/API.
- Telegram Bot API: отправлять уведомления о статусах и отчётах.
- SMS-уведомления: добавить провайдера и события по изменению заказа.
- Хранение файлов: локально через `UPLOAD_DIR`; для масштабирования можно заменить на S3-совместимое хранилище.

## Деплой на Render

Проект можно деплоить как Render Web Service с Render Postgres и Persistent Disk для загруженных фото.

### Вариант через `render.yaml`

1. Загрузите проект в GitHub.
2. В Render выберите **Blueprint** и подключите репозиторий.
3. Render прочитает `render.yaml` и создаст:
   - Web Service `memorial-visit`;
   - PostgreSQL `memorial-visit-db`;
   - Persistent Disk `/var/data/uploads` для фото.
4. При создании задайте `NEXT_PUBLIC_APP_URL`, например:

```env
NEXT_PUBLIC_APP_URL="https://your-service.onrender.com"
```

Миграции выполняются командой `npm run prisma:deploy` в `preDeployCommand`.

### Вариант вручную

1. Создайте **Render Postgres**.
2. Создайте **Web Service** из GitHub-репозитория.
3. Укажите:

```bash
Build Command: npm ci && npm run build
Pre-deploy Command: npm run prisma:deploy
Start Command: npm start
```

4. Добавьте переменные окружения:

```env
DATABASE_URL=<Internal Database URL из Render Postgres>
JWT_SECRET=<длинная случайная строка>
NEXT_PUBLIC_APP_URL=https://your-service.onrender.com
UPLOAD_DIR=/var/data/uploads
```

5. В настройках Web Service добавьте Persistent Disk:

```text
Mount path: /var/data/uploads
Size: 1 GB или больше
```

Важно: без Persistent Disk локальные загруженные фото будут теряться после redeploy/restart. Для масштабирования на несколько инстансов лучше заменить диск на S3/Cloudflare R2/Supabase Storage.

### Seed в production

Не запускайте `npm run db:seed` на production-базе: текущий seed очищает таблицы и создаёт демо-данные. Для первого администратора лучше создать пользователя через регистрацию и поменять роль в базе на `admin`, либо сделать отдельный безопасный admin-seed.

## Архитектура

```text
src/app              страницы и API Routes
src/components       переиспользуемые UI-компоненты и формы
src/lib              Prisma, auth, валидация, форматирование, константы
prisma/schema.prisma схема базы данных
prisma/seed.ts       тестовые данные
public/uploads       локальные загруженные файлы в dev
src/app/api/files    отдача загруженных файлов из UPLOAD_DIR
```

Места для будущих интеграций уже отражены в `.env.example` и полях заказа: `zoomLink`, `telegramLink`, `videoReportUrl`.

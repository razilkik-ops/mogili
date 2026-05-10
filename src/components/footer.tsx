import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-ink text-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-semibold">Тихое посещение</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            Онлайн-сервис деликатного посещения и ухода за местами захоронения. Работаем спокойно,
            аккуратно и с уважением к памяти близких.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <p className="font-semibold text-white">Разделы</p>
          <Link href="/services" className="block hover:text-white">
            Услуги
          </Link>
          <Link href="/contacts" className="block hover:text-white">
            Контакты
          </Link>
          <Link href="/dashboard" className="block hover:text-white">
            Личный кабинет
          </Link>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <p className="font-semibold text-white">Связь</p>
          <p>Telegram: @quiet_visit</p>
          <p>WhatsApp: +375 29 000-00-00</p>
          <p>Email: hello@memorial.local</p>
        </div>
      </div>
    </footer>
  );
}

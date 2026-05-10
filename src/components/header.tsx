import Link from "next/link";
import { Leaf, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#fbf8f1]/80 backdrop-blur-2xl">
      <div className="container-page flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 font-semibold text-ink">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white shadow-lift transition group-hover:bg-moss">
            <Leaf className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-base">Тихое посещение</span>
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.2em] text-moss sm:block">
              Memorial Visit
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-stonewarm/80 bg-white/60 p-1 text-sm font-semibold text-graphite shadow-sm backdrop-blur-xl md:flex">
          <Link href="/services" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink">
            Услуги
          </Link>
          <Link href="/contacts" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink">
            Контакты
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink">
                Кабинет
              </Link>
              {user.role === "admin" ? (
                <Link href="/admin" className="inline-flex items-center gap-1 rounded-full px-4 py-2 transition hover:bg-white hover:text-ink">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  Админ
                </Link>
              ) : null}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink">
                Войти
              </Link>
              <Link href="/register" className="btn-primary min-h-10 rounded-full px-5">
                Регистрация
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          {user ? (
            <Link href="/dashboard" className="btn-secondary px-3">
              Кабинет
            </Link>
          ) : (
            <Link href="/login" className="btn-secondary px-3">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

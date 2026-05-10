"use client";

import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type MobileMenuProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export function MobileMenu({ isAuthenticated, isAdmin }: MobileMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="btn-secondary px-3"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-stonewarm/90 bg-white/95 p-3 shadow-lift backdrop-blur-xl">
          <nav className="grid gap-2 text-sm font-semibold text-graphite">
            <Link href="/services" className="rounded-md px-3 py-2 transition hover:bg-mist hover:text-ink" onClick={() => setOpen(false)}>
              Услуги
            </Link>
            <Link href="/contacts" className="rounded-md px-3 py-2 transition hover:bg-mist hover:text-ink" onClick={() => setOpen(false)}>
              Контакты
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="rounded-md px-3 py-2 transition hover:bg-mist hover:text-ink" onClick={() => setOpen(false)}>
                  Кабинет
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-mist hover:text-ink"
                    onClick={() => setOpen(false)}
                  >
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    Админ
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={logout}
                  disabled={loading}
                  className="btn-primary mt-1 w-full justify-center rounded-md px-3"
                >
                  {loading ? "Выход..." : "Выйти"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-md px-3 py-2 transition hover:bg-mist hover:text-ink" onClick={() => setOpen(false)}>
                  Войти
                </Link>
                <Link href="/register" className="btn-primary mt-1 w-full justify-center rounded-md px-3" onClick={() => setOpen(false)}>
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

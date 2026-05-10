import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <p className="eyebrow text-center">Вход</p>
        <h1 className="display-title mt-4 text-center text-5xl">Личный кабинет</h1>
        <p className="mt-3 text-center muted">
          Тестовый пользователь: user@memorial.local / User12345
        </p>
        <div className="mt-6">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>
        <p className="mt-5 text-center text-sm text-graphite">
          Нет кабинета?{" "}
          <Link href="/register" className="font-semibold text-moss">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </section>
  );
}

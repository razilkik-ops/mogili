import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <section className="container-page flex min-h-[70svh] items-center justify-center py-8 sm:py-12">
      <div className="w-full max-w-md">
        <p className="eyebrow text-center">Регистрация</p>
        <h1 className="display-title mt-4 text-center text-4xl sm:text-5xl">Создать кабинет</h1>
        <p className="mt-3 text-center muted">После регистрации можно добавить могилу и оформить первый заказ.</p>
        <div className="mt-6">
          <Suspense>
            <AuthForm mode="register" />
          </Suspense>
        </div>
        <p className="mt-5 text-center text-sm text-graphite">
          Уже есть кабинет?{" "}
          <Link href="/login" className="font-semibold text-moss">
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
}

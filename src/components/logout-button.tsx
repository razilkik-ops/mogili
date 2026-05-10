"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-graphite transition hover:bg-white hover:text-ink"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      Выйти
    </button>
  );
}

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createSession } from "@/actions/auth";

export const AuthRedirect = () => {
  const search = useSearchParams();

  useEffect(() => {
    const token = search.get("token");
    if (token) {
      createSession(token);
      return;
    }
    const main = process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "";
    window.location.href = `${main}/auth/staff`;
  }, [search]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--color-bg-default)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--blue-500)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-muted)]">Redirecting…</p>
      </div>
    </div>
  );
};

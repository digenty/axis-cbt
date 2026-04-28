"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const AuthRedirect = () => {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const returnTo = search.get("returnTo") ?? "/subjects";
    router.replace(returnTo);
  }, [router, search]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--color-bg-default)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--blue-500)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-muted)]">Redirecting…</p>
      </div>
    </div>
  );
};

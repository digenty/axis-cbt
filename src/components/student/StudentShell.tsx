"use client";

import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxisLogo } from "@/components/layout/AxisLogo";
import { clearStudentSession } from "@/lib/auth-session";

const INACTIVITY_MS = 15 * 60 * 1000;

interface StudentShellProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export const StudentShell = ({ children, hideHeader }: StudentShellProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => clearStudentSession(), INACTIVITY_MS);
    };

    const events = ["mousemove", "keydown", "touchstart", "scroll"] as const;
    events.forEach((e) =>
      document.addEventListener(e, reset, { passive: true }),
    );
    reset();

    return () => {
      events.forEach((e) => document.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg-default)">
      {!hideHeader && (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-(--color-border-default) bg-(--color-bg-default) px-4 md:px-6">
          <div className="flex items-center gap-2">
            <AxisLogo />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearStudentSession()}
          >
            <LogOut className="mr-1 h-3.5 w-3.5" />
            Log out
          </Button>
        </header>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
};

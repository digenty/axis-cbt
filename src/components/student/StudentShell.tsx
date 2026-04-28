"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxisLogo } from "@/components/layout/AxisLogo";
import { toast } from "sonner";

interface StudentShellProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export const StudentShell = ({ children, hideHeader }: StudentShellProps) => (
  <div className="flex min-h-screen flex-col bg-[var(--color-bg-default)]">
    {!hideHeader && (
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 md:px-6">
        <div className="flex items-center gap-2">
          <AxisLogo />
          <span className="text-sm text-[var(--color-text-subtle)]">
            Digenty
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.info("Logout", {
              description: "Auth flow isn't part of the CBT preview.",
            })
          }
        >
          <LogOut className="mr-1 h-3.5 w-3.5" />
          Log out
        </Button>
      </header>
    )}
    <main className="flex-1">{children}</main>
  </div>
);

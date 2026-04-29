"use client";

import { Menu } from "lucide-react";
import Notification2 from "@/Icons/Notification2";
import QuestionFill from "@/Icons/QuestionFill";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebarStore } from "@/store/sidebar";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title?: string;
  className?: string;
}

export const Topbar = ({ title = "CBT", className }: TopbarProps) => {
  const { setIsSidebarOpen } = useSidebarStore();

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 md:px-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)] md:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm text-[var(--color-text-subtle)]">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-xs text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <QuestionFill
            className="h-3.5 w-3.5"
            fill="var(--color-icon-default-subtle)"
          />
          Help
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
          aria-label="Notifications"
        >
          <Notification2 className="h-[18px] w-[18px]" fill="currentColor" />
        </button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="" />
          <AvatarFallback className="bg-[var(--color-bg-muted)] text-xs text-[var(--color-text-subtle)]">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

"use client";

import {
  CheckCircle2,
  CircleDot,
  Clock,
  Cloud,
  FileText,
  XCircle,
  RotateCcw,
} from "lucide-react";
import type { TestStatus, AttemptStatus } from "@/types/results";
import { cn } from "@/lib/utils";

type StatusKey = TestStatus | AttemptStatus;

const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: string;
    bg: string;
    text: string;
    ring: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  published: {
    label: "Published",
    bg: "bg-[var(--color-bg-badge-green)]",
    text: "text-[var(--green-700)]",
    ring: "ring-[var(--color-border-green)]",
    Icon: Cloud,
  },
  draft: {
    label: "Draft",
    bg: "bg-[var(--color-bg-badge-gray)]",
    text: "text-[var(--color-text-subtle)]",
    ring: "ring-[var(--color-border-default)]",
    Icon: FileText,
  },
  completed: {
    label: "Completed",
    bg: "bg-[var(--color-bg-badge-teal)]",
    text: "text-[var(--teal-700)]",
    ring: "ring-[var(--color-border-teal)]",
    Icon: CheckCircle2,
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-[var(--color-bg-badge-orange)]",
    text: "text-[var(--orange-700)]",
    ring: "ring-[var(--color-border-orange)]",
    Icon: CircleDot,
  },
  submitted: {
    label: "Submitted",
    bg: "bg-[var(--color-bg-badge-violet)]",
    text: "text-[var(--violet-700)]",
    ring: "ring-[var(--color-border-violet)]",
    Icon: Clock,
  },
  missed: {
    label: "Missed",
    bg: "bg-[var(--color-bg-badge-red)]",
    text: "text-[var(--red-700)]",
    ring: "ring-[var(--color-border-red)]",
    Icon: XCircle,
  },
  graded: {
    label: "Graded",
    bg: "bg-[var(--color-bg-badge-green)]",
    text: "text-[var(--green-700)]",
    ring: "ring-[var(--color-border-green)]",
    Icon: CheckCircle2,
  },
  "retake-pending": {
    label: "Retake Pending",
    bg: "bg-[var(--color-bg-badge-purple)]",
    text: "text-[var(--purple-700)]",
    ring: "ring-[var(--color-border-purple)]",
    Icon: RotateCcw,
  },
};

interface StatusBadgeProps {
  status: StatusKey;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  const { Icon } = cfg;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        cfg.bg,
        cfg.text,
        cfg.ring,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
};

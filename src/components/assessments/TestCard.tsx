"use client";

import Link from "next/link";
import {
  Trash2,
  Pencil,
  Star,
  Clock,
  FileText,
  Calendar,
  Tag,
  Monitor,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Test } from "@/types";

interface TestCardProps {
  test: Test;
  href: string;
  onDelete?: () => void;
}

export const TestCard = ({ test, href, onDelete }: TestCardProps) => (
  <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-badge-green)]">
        <Monitor className="h-4 w-4 text-[var(--green-600)]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-[var(--color-text-default)]">
            {test.title}
          </h3>
          <StatusBadge status={test.status} />
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">{test.term}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--color-text-subtle)]">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {test.questionCount} questions
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-[var(--amber-500)]" />
            {test.totalMarks} marks
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {test.duration} min
          </span>
          {test.mappingLabel && (
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {test.mappingLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(test.testDate)}
          </span>
          <span>{test.testType}</span>
        </div>
      </div>
      <div className="flex gap-1">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-badge-red)] hover:text-[var(--color-icon-destructive)]"
            aria-label="Delete test"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
        <Link
          href={href}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-state-soft-hover)]"
          aria-label="Edit test"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </div>
);

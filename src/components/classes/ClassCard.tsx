"use client";

import Link from "next/link";
import { ArrowRight, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Class } from "@/types";

interface ClassCardProps {
  cls: Class;
}

export const ClassCard = ({ cls }: ClassCardProps) => (
  <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="text-sm font-semibold text-[var(--color-text-default)]">
          {cls.name}
        </div>
        <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          {cls.school}
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-badge-gray)] px-2 py-0.5 text-[11px] text-[var(--color-text-subtle)]">
        <BookText className="h-3 w-3" />
        {cls.totalSubjects} Subjects
      </span>
    </div>

    <Button
      asChild
      variant="outline"
      className="mt-4 w-full justify-center font-medium"
    >
      <Link href={`/classes/${cls.id}`}>
        Open
        <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </Link>
    </Button>
  </div>
);

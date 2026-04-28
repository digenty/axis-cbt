"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { BookOpenCheck, ClipboardList, BarChart3 } from "lucide-react";
import { useCBTStore } from "@/store";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

interface SubjectDetailViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

const HUB_CARDS = [
  {
    key: "question-bank",
    title: "Question Bank",
    description: "Create and manage reusable questions",
    icon: BookOpenCheck,
    bg: "bg-[var(--color-bg-badge-green)]",
    iconColor: "text-[var(--green-600)]",
  },
  {
    key: "assessments",
    title: "Assessments",
    description: "Create, manage and assign assessments",
    icon: ClipboardList,
    bg: "bg-[var(--color-bg-badge-teal)]",
    iconColor: "text-[var(--teal-600)]",
  },
  {
    key: "results",
    title: "Results",
    description: "View test results and analytics",
    icon: BarChart3,
    bg: "bg-[var(--color-bg-badge-blue)]",
    iconColor: "text-[var(--blue-600)]",
  },
] as const;

export const SubjectDetailView = ({ params }: SubjectDetailViewProps) => {
  const { classId, subjectId } = use(params);
  const { classes, subjects } = useCBTStore();

  const cls = useMemo(
    () => classes.find((c) => c.id === classId),
    [classes, classId],
  );
  const subject = useMemo(
    () => subjects.find((s) => s.id === subjectId),
    [subjects, subjectId],
  );

  if (!cls || !subject) {
    return (
      <div className="px-6 py-6">
        <PageHeader title="Subject not found" showBack backHref="/subjects" />
        <EmptyState title="We couldn't find this subject" />
      </div>
    );
  }

  const title = `${cls.name.replace(" ", "")} ${subject.name}`;

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title={title} showBack backHref={`/classes/${cls.id}`} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HUB_CARDS.map((card) => (
          <Link
            key={card.key}
            href={`/classes/${cls.id}/subjects/${subject.id}/${card.key}`}
            className="group rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-5 transition-colors hover:border-[var(--color-border-darker)] hover:bg-[var(--color-bg-card-subtle)]"
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                card.bg,
              )}
            >
              <card.icon className={cn("h-5 w-5", card.iconColor)} />
            </div>
            <div className="mt-4">
              <div className="text-base font-semibold text-[var(--color-text-default)]">
                {card.title}
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

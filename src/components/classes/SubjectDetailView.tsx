"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { HardDrive, ClipboardList, BarChart3, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import {
  useGetClassDetails,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import { Skeleton } from "../ui/skeleton";

interface SubjectDetailViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

const HUB_CARDS = [
  {
    key: "question-bank",
    title: "Question Bank",
    description: "Create and manage reusable questions",
    icon: HardDrive,
    accent: "bg-[var(--color-bg-basic-lime-accent)]",
  },
  {
    key: "assessments",
    title: "Assessments",
    description: "Create, manage and assign assessments",
    icon: ClipboardList,
    accent: "bg-[var(--color-bg-basic-teal-accent)]",
  },
  {
    key: "results",
    title: "Results",
    description: "View test results and analytics",
    icon: BarChart3,
    accent: "bg-[var(--color-bg-basic-cyan-accent)]",
  },
] as const;

export const SubjectDetailView = ({ params }: SubjectDetailViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);

  const { data: classDetails, isLoading: classLoading } =
    useGetClassDetails(classId);
  const { data: teacherSubjects, isLoading: subjectsLoading } =
    useGetTeacherSubjects();

  const subject = useMemo(
    () => teacherSubjects?.data?.find((s) => s.subjectId === subjectId),
    [teacherSubjects, subjectId],
  );

  const className = useMemo(() => {
    const raw = classDetails as
      | { data?: { name?: string } }
      | { name?: string }
      | undefined;
    if (!raw) return "";
    if ("data" in raw && raw.data?.name) return raw.data.name;
    if ("name" in raw && typeof raw.name === "string") return raw.name;
    return "";
  }, [classDetails]);

  if (classLoading || subjectsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-4 md:p-8">
        <Skeleton className="h-100 w-full bg-bg-state-soft" />
      </div>
    );
  }

  if (!className || !subject) {
    return (
      <div className="px-6 py-6">
        <PageHeader title="Subject not found" showBack backHref="/subjects" />
        <EmptyState title="We couldn't find this subject" />
      </div>
    );
  }

  const title = `${className.replace(" ", "")} ${subject.subjectName}`;

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title={title} showBack backHref="/subjects" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HUB_CARDS.map((card) => (
          <Link
            key={card.key}
            href={`/classes/${classId}/subjects/${subjectId}/${card.key}`}
            className="group rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-5 transition-colors hover:border-[var(--color-border-darker)] hover:bg-[var(--color-bg-card-subtle)]"
          >
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-lg border-2 border-white/20 shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08)]",
                card.accent,
              )}
            >
              <card.icon className="h-5 w-5 text-white" />
            </div>
            <div className="mt-4">
              <div className="text-base font-medium text-[var(--color-text-default)]">
                {card.title}
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

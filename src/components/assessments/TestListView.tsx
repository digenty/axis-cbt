"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TestCard } from "./TestCard";
import { CreateTestModal } from "./CreateTestModal";
import {
  useGetClassDetails,
  useGetSubjectsByClassId,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import {
  useDeleteAssessment,
  useGetAssessments,
} from "@/hooks/queryHooks/useAssessment";
import { apiAssessmentToTest } from "@/types/assessment.mapper";
import { toast } from "sonner";

interface TestListViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const TestListView = ({ params }: TestListViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const { data: classDetails } = useGetClassDetails(classId);
  const { data: teacherSubjects } = useGetTeacherSubjects();
  const { data: classSubjects } = useGetSubjectsByClassId(classId);

  const branchId = useMemo(
    () => classSubjects?.data?.find((s) => s.id === subjectId)?.branchId,
    [classSubjects, subjectId],
  );

  const {
    data: assessmentsRes,
    isLoading: assessmentsLoading,
    isError: assessmentsError,
  } = useGetAssessments({
    branchId: branchId ?? 0,
    classId,
    subjectId,
  });

  const tests = useMemo(
    () => (assessmentsRes?.data ?? []).map((a) => apiAssessmentToTest(a)),
    [assessmentsRes],
  );

  const deleteMutation = useDeleteAssessment(classId, subjectId, branchId ?? 0);

  const handleDelete = (id: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Delete this test? This cannot be undone.")
    ) {
      return;
    }
    deleteMutation.mutate(Number(id), {
      onSuccess: () => toast.success("Test deleted"),
      onError: () => toast.error("Failed to delete test"),
    });
  };

  const subjectName = useMemo(
    () =>
      teacherSubjects?.data?.find((s) => s.subjectId === subjectId)
        ?.subjectName ?? "",
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

  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="CBT"
        showBack
        backHref={baseUrl}
        right={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Create New Test
          </Button>
        }
      />

      {assessmentsLoading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
        </div>
      ) : assessmentsError ? (
        <div className="mt-12">
          <EmptyState
            title="Failed to load tests"
            description="Please refresh the page to try again."
          />
        </div>
      ) : tests.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={<Box className="h-10 w-10" />}
            title="No Tests Yet"
            description="Add tests to view and manage their records here."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Create New Test
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {tests.map((t) => (
            <TestCard
              key={t.id}
              test={t}
              href={`${baseUrl}/assessments/${t.id}`}
              onDelete={() => handleDelete(t.id)}
            />
          ))}
        </div>
      )}

      <CreateTestModal
        open={showModal}
        setOpen={setShowModal}
        classId={classIdStr}
        subjectId={subjectIdStr}
        branchId={branchId}
        className={className}
        subjectName={subjectName}
        onSuccess={(testId) => router.push(`${baseUrl}/assessments/${testId}`)}
      />
    </div>
  );
};

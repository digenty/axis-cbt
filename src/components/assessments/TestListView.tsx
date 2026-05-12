"use client";

import { use, useMemo, useState } from "react";
import { Box, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TestCard } from "./TestCard";
import { CreateTestModal } from "./CreateTestModal";
import { DeleteTestDialog } from "./DeleteTestDialog";
import {
  useGetClassDetails,
  useGetSubjectsByClassId,
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
  const [showModal, setShowModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: classDetails } = useGetClassDetails(classId);
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

  const handleDelete = (id: string) => setDeleteTargetId(id);

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(Number(deleteTargetId), {
      onSuccess: () => {
        toast.success("Test deleted");
        setDeleteTargetId(null);
      },
      onError: () => {
        toast.error("Failed to delete test");
        setDeleteTargetId(null);
      },
    });
  };

  const subjectName = useMemo(
    () => classSubjects?.data?.find((s) => s.id === subjectId)?.name ?? "",
    [classSubjects, subjectId],
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
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              href={`${baseUrl}/assessments/${test.id}`}
              onDelete={() => handleDelete(test.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTestModal
          open={showModal}
          setOpen={setShowModal}
          classId={classIdStr}
          subjectId={subjectIdStr}
          branchId={branchId}
          className={className}
          subjectName={subjectName}
          onSuccess={() => {}}
        />
      )}

      <DeleteTestDialog
        open={deleteTargetId !== null}
        setOpen={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

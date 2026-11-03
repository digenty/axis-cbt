"use client";

import { use, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Check, Copy, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TestCard } from "./TestCard";
import { CreateTestModal } from "./CreateTestModal";
import { DeleteTestDialog } from "./DeleteTestDialog";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useGetSubjectsByArmId } from "@/hooks/queryHooks/useSubjects";
import { useGetMyAssessments } from "@/hooks/queryHooks/useCbtOverview";
import {
  useDeleteAssessment,
  useGetAssessments,
} from "@/hooks/queryHooks/useAssessment";
import {
  apiAssessmentToTest,
  teacherAssessmentListItemToTest,
} from "@/types/assessment.mapper";
import { toast } from "@/components/common/Toast";

interface TestListViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const TestListView = ({ params }: TestListViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const [showModal, setShowModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const studentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/student`;

  const handleCopy = () => {
    navigator.clipboard.writeText(studentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const searchParams = useSearchParams();
  const className = searchParams.get("className") ?? "";
  const subjectName = searchParams.get("subjectName") ?? "";
  const armIdParam = searchParams.get("armId") ?? "";
  const armId = Number(armIdParam);
  const canManageParam = searchParams.get("canManage") ?? "0";
  const canManage = canManageParam === "1";
  const mine = searchParams.get("mine") === "1";

  // Teachers can't call the admin class/subject lookup endpoints, so the branch
  // is resolved from the arm (CBT-scoped, works for teacher and admin alike),
  // falling back to the logged-in user's own branch if no armId made it into the URL.
  const { data: armSubjects } = useGetSubjectsByArmId(armId);
  const { branchIds } = useLoggedInUser();
  const branchId = armSubjects?.data?.branchId ?? branchIds?.[0];

  // The admin-only `/api/cbt/assessments?branchId=&classId=&subjectId=` listing 403s for a
  // teacher token, so a teacher viewing their own subject uses the teacher-scoped
  // `/api/cbt/assessments/my` listing instead, filtered down to this class/subject.
  const {
    data: myAssessmentsRes,
    isLoading: myAssessmentsLoading,
    isError: myAssessmentsError,
  } = useGetMyAssessments({ enabled: mine });
  const {
    data: assessmentsRes,
    isLoading: assessmentsLoading,
    isError: assessmentsError,
  } = useGetAssessments({
    branchId: branchId ?? 0,
    classId,
    subjectId,
    enabled: !mine,
  });

  const tests = useMemo(() => {
    if (mine) {
      return (myAssessmentsRes?.data ?? [])
        .filter((a) => a.classId === classId && a.subjectId === subjectId)
        .map(teacherAssessmentListItemToTest);
    }
    return (assessmentsRes?.data ?? []).map((a) => apiAssessmentToTest(a));
  }, [mine, myAssessmentsRes, assessmentsRes, classId, subjectId]);

  const isTestsLoading = mine ? myAssessmentsLoading : assessmentsLoading;
  const isTestsError = mine ? myAssessmentsError : assessmentsError;

  const deleteMutation = useDeleteAssessment(classId, subjectId, branchId ?? 0);

  const handleDelete = (id: string) => setDeleteTargetId(id);

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(Number(deleteTargetId), {
      onSuccess: () => {
        toast({ title: "Test deleted", type: "success" });
        setDeleteTargetId(null);
      },
      onError: () => {
        toast({ title: "Failed to delete test", type: "error" });
        setDeleteTargetId(null);
      },
    });
  };


  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;
  const childQs = new URLSearchParams({
    className,
    subjectName,
    armId: armIdParam,
    canManage: canManageParam,
  }).toString();

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="CBT"
        showBack
        right={
          canManage && (
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Create New Test
            </Button>
          )
        }
      />

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-bg-badge-green  px-4 py-3 text-sm">
        <span className="flex-1 text-bg-basic-green-contrast border-l-2 pl-2">
          <span className="font-medium">Student login link: </span>
          <span className="font-mono font-semibold">{studentUrl}</span>
          <span className="ml-1 text-xs opacity-70">
            — share this with your students.
          </span>
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-bg-basic-green-accent bg-white/20 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-white/30 text-bg-basic-green-contrast"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {isTestsLoading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
        </div>
      ) : isTestsError ? (
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
              canManage ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Create New Test
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              href={`${baseUrl}/assessments/${test.id}?${childQs}`}
              onDelete={canManage ? () => handleDelete(test.id) : undefined}
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

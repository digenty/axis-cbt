"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Plus } from "lucide-react";
import { useCBTStore } from "@/store";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TestCard } from "./TestCard";
import { CreateTestModal } from "./CreateTestModal";
import { toast } from "sonner";

interface TestListViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const TestListView = ({ params }: TestListViewProps) => {
  const { classId, subjectId } = use(params);
  const router = useRouter();
  const { tests, subjects, classes, deleteTest } = useCBTStore();

  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(
    () =>
      tests.filter((t) => t.subjectId === subjectId && t.classId === classId),
    [tests, classId, subjectId],
  );

  const subject = useMemo(
    () => subjects.find((s) => s.id === subjectId),
    [subjects, subjectId],
  );
  const cls = useMemo(
    () => classes.find((c) => c.id === classId),
    [classes, classId],
  );

  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

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

      {filtered.length === 0 ? (
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
          {filtered.map((t) => (
            <TestCard
              key={t.id}
              test={t}
              href={`${baseUrl}/assessments/${t.id}`}
              onDelete={() => {
                deleteTest(t.id);
                toast.success("Test deleted");
              }}
            />
          ))}
        </div>
      )}

      <CreateTestModal
        open={showModal}
        setOpen={setShowModal}
        classId={classId}
        subjectId={subjectId}
        className={cls?.name ?? ""}
        subjectName={subject?.name ?? ""}
        onSuccess={(testId) => router.push(`${baseUrl}/assessments/${testId}`)}
      />
    </div>
  );
};

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
import {
  useGetClassDetails,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";

interface TestListViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const TestListView = ({ params }: TestListViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const router = useRouter();
  const { tests, deleteTest } = useCBTStore();

  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(
    () =>
      tests.filter(
        (t) => t.subjectId === subjectIdStr && t.classId === classIdStr,
      ),
    [tests, classIdStr, subjectIdStr],
  );

  const { data: classDetails } = useGetClassDetails(classId);
  const { data: teacherSubjects } = useGetTeacherSubjects();

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
        classId={classIdStr}
        subjectId={subjectIdStr}
        className={className}
        subjectName={subjectName}
        onSuccess={(testId) => router.push(`${baseUrl}/assessments/${testId}`)}
      />
    </div>
  );
};

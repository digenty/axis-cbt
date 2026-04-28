"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Plus } from "lucide-react";
import { useCBTStore } from "@/store";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TestCard } from "./TestCard";
import type { Test } from "@/types";
import { toast } from "sonner";

interface TestListViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const TestListView = ({ params }: TestListViewProps) => {
  const { classId, subjectId } = use(params);
  const router = useRouter();
  const { tests, addTest, deleteTest } = useCBTStore();

  const filtered = useMemo(
    () =>
      tests.filter((t) => t.subjectId === subjectId && t.classId === classId),
    [tests, classId, subjectId],
  );

  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

  const handleCreate = () => {
    const newTest: Test = {
      id: generateId(),
      title: "Untitled Test",
      subjectId,
      classId,
      term: "First Term",
      testType: "Continuous Assessment",
      assessmentMapping: "",
      mappingLabel: "",
      testDate: new Date().toISOString().slice(0, 10),
      startTime: "09:00",
      amPm: "AM",
      duration: 60,
      studentResultAccess: false,
      status: "draft",
      sections: [
        {
          id: generateId(),
          title: "Section A",
          instruction: "",
          questionIds: [],
        },
      ],
      totalMarks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTest(newTest);
    router.push(`${baseUrl}/assessments/${newTest.id}`);
  };

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="CBT"
        showBack
        backHref={baseUrl}
        right={
          <Button onClick={handleCreate}>
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
              <Button variant="outline" size="sm" onClick={handleCreate}>
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
    </div>
  );
};

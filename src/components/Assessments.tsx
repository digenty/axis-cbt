"use client";

import { use } from "react";
import { ClipboardList } from "lucide-react";
// import { BackButton } from "@/components/PageHeader";
import { Button } from "./ui";
import { BackButton } from "./PageHeader";

export default function Assessments({
  params,
}: Readonly<{
  params: Promise<{ classId: string; subjectId: string }>;
}>) {
  const { classId, subjectId } = use(params);

  return (
    <div>
      <BackButton href={`/classes/${classId}/subjects/${subjectId}`} />
      <h1 className="mb-6 text-base font-semibold text-gray-900">
        Assessments
      </h1>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
          <ClipboardList className="h-6 w-6 text-blue-500" />
        </div>
        <p className="mb-1 text-sm font-medium text-gray-600">
          No assessments yet
        </p>
        <p className="mb-5 max-w-xs text-xs text-gray-400">
          Create your first assessment to assign tests to students
        </p>
        <Button size="sm" variant="primary">
          Create Assessment
        </Button>
      </div>
    </div>
  );
}

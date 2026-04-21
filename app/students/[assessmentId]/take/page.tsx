"use client";

import { use } from "react";
import { StudentTestTakerView } from "@/components/students/StudentTestTakerView";

export default function StudentTestTakerPage({
  params,
  searchParams,
}: {
  params: Promise<{ assessmentId: string }>;
  searchParams: Promise<{ sid?: string }>;
}) {
  const { assessmentId } = use(params);
  const { sid } = use(searchParams);
  const studentAssessmentId = sid ? Number(sid) : null;
  return (
    <StudentTestTakerView
      assessmentId={assessmentId}
      studentAssessmentId={studentAssessmentId}
    />
  );
}

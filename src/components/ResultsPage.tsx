"use client";

import { useCBTStore } from "@/store";
import { use } from "react";
import { ResultsView } from "./ResultsView";
import Layout from "./Layout";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
}) {
  const { classId, subjectId } = use(params);
  const cls = useCBTStore((s) => s.classes.find((c) => c.id === classId));
  const subject = useCBTStore((s) =>
    s.subjects.find((sub) => sub.id === subjectId),
  );

  return (
    <Layout href={`/classes/${classId}/subjects/${subjectId}`}>
      <ResultsView
        subjectId={subjectId}
        classId={classId}
        className={cls?.name || classId}
        subjectName={subject?.name || subjectId}
      />
    </Layout>
  );
}

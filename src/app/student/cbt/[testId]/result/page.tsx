import { StudentResultView } from "@/components/student/StudentResultView";
import { StudentShell } from "@/components/student/StudentShell";

export default function StudentResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ assessmentId?: string }>;
}) {
  return (
    <StudentShell>
      <StudentResultView params={params} searchParams={searchParams} />
    </StudentShell>
  );
}

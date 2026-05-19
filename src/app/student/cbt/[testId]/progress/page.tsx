import { TestProgressPage } from "@/components/student/TestProgressPage";

export default function StudentTestProgressPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  return <TestProgressPage params={params} />;
}

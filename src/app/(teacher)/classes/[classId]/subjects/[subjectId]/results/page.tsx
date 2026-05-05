import { ResultsView } from "@/components/results/ResultsView";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
}) {
  return <ResultsView params={params} />;
}

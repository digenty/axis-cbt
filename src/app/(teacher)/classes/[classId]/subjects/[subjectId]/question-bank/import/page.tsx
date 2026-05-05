import { ImportQuestionsView } from "@/components/question-bank/ImportQuestionsView";

export default function ImportQuestionsPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
}) {
  return <ImportQuestionsView params={params} />;
}

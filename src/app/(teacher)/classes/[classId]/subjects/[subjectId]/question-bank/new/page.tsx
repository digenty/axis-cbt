import { QuestionEditor } from "@/components/question-bank/QuestionEditor";

export default function NewQuestionPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
}) {
  return <QuestionEditor params={params} mode="create" />;
}

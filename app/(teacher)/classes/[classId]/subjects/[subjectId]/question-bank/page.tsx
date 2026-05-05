import { QuestionBankView } from "@/components/question-bank/QuestionBankView";

export default function QuestionBankPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string }>;
}) {
	return <QuestionBankView params={params} />;
}

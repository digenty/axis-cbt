import { QuestionEditor } from "@/components/question-bank/QuestionEditor";

export default function EditQuestionPage({
	params,
}: {
	params: Promise<{
		classId: string;
		subjectId: string;
		questionId: string;
	}>;
}) {
	return <QuestionEditor params={params} mode="edit" />;
}

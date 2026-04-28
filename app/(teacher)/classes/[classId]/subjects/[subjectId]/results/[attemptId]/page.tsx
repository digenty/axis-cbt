import { GradeAttemptView } from "@/components/results/GradeAttemptView";

export default function GradeAttemptPage({
	params,
}: {
	params: Promise<{
		classId: string;
		subjectId: string;
		attemptId: string;
	}>;
}) {
	return <GradeAttemptView params={params} />;
}

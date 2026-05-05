import { TestEditor } from "@/components/assessments/TestEditor";

export default function AssessmentEditorPage({
	params,
}: {
	params: Promise<{
		classId: string;
		subjectId: string;
		assessmentId: string;
	}>;
}) {
	return <TestEditor params={params} />;
}

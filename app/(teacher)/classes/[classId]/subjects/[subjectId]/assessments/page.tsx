import { TestListView } from "@/components/assessments/TestListView";

export default function AssessmentsPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string }>;
}) {
	return <TestListView params={params} />;
}

import { StudentTestPage } from "@/components/student/StudentTestPage";

export default function StudentTestEntryPage({
	params,
}: {
	params: Promise<{ testId: string }>;
}) {
	return <StudentTestPage params={params} />;
}

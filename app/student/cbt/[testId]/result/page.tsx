import { StudentResultView } from "@/components/student/StudentResultView";
import { StudentShell } from "@/components/student/StudentShell";

export default function StudentResultPage({
	params,
}: {
	params: Promise<{ testId: string }>;
}) {
	return (
		<StudentShell>
			<StudentResultView params={params} />
		</StudentShell>
	);
}

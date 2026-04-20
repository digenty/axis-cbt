"use client";

import { use } from "react";
import { TestListView } from "@/components/assessments/TestListView";
import Layout from "@/components/Layout";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubjects";

export default function AssessmentsPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string }>;
}) {
	const { classId, subjectId } = use(params);

	const { data: subjectsResponse } = useGetTeacherSubjects();
	const subjects: { subjectId: number; subjectName: string }[] =
		subjectsResponse?.data ?? [];
	const subject = subjects.find((s) => s.subjectId === Number(subjectId));
	const subjectName = subject?.subjectName ?? subjectId;

	return (
		<Layout href={`/classes/${classId}/subjects/${subjectId}`}>
			<TestListView
				subjectId={Number(subjectId)}
				classId={Number(classId)}
				subjectName={subjectName}
			/>
		</Layout>
	);
}

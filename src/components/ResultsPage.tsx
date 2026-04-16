"use client";

import { use } from "react";
import { ResultsView } from "./ResultsView";
import Layout from "./Layout";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubjects";

export default function ResultsPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string }>;
}) {
	const { classId, subjectId } = use(params);

	const classIdNum = Number(classId);
	const subjectIdNum = Number(subjectId);

	const { data: classDetailsResponse } = useGetClassDetails(classIdNum);
	const { data: subjectsResponse } = useGetTeacherSubjects();

	const classDetails = classDetailsResponse?.data;
	const subjects: { subjectId: number; subjectName: string }[] =
		subjectsResponse?.data ?? [];
	const subject = subjects.find((s) => s.subjectId === subjectIdNum);

	const className = classDetails?.name ?? classId;
	const subjectName = subject?.subjectName ?? subjectId;

	return (
		<Layout href={`/classes/${classId}/subjects/${subjectId}`}>
			<ResultsView
				subjectId={subjectIdNum}
				classId={classIdNum}
				className={className}
				subjectName={subjectName}
			/>
		</Layout>
	);
}

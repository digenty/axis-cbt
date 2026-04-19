"use client";

import { use } from "react";
import { TestEditor } from "@/components/assessments/TestEditor";
import Layout from "@/components/Layout";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubjects";

export default function TestEditorPage({
	params,
}: {
	params: Promise<{
		classId: string;
		subjectId: string;
		assessmentId: string;
	}>;
}) {
	const { classId, subjectId, assessmentId } = use(params);

	const classIdNum = Number(classId);
	const subjectIdNum = Number(subjectId);
	const assessmentIdNum = Number(assessmentId);

	const { data: classDetailsResponse } = useGetClassDetails(classIdNum);
	const { data: subjectsResponse } = useGetTeacherSubjects();

	const classDetails = classDetailsResponse?.data;
	const subjects: { subjectId: number; subjectName: string }[] =
		subjectsResponse?.data ?? [];
	const subject = subjects.find((s) => s.subjectId === subjectIdNum);

	const className = classDetails?.name ?? classId;
	const subjectName = subject?.subjectName ?? subjectId;

	return (
		<Layout href={`/classes/${classId}/subjects/${subjectId}/assessments`}>
			<TestEditor
				assessmentId={assessmentIdNum}
				classId={classIdNum}
				subjectId={subjectIdNum}
				className={className}
				subjectName={subjectName}
			/>
		</Layout>
	);
}

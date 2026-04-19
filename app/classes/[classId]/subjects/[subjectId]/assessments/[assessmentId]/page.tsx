"use client";

import { use } from "react";
<<<<<<< HEAD
import { TestEditor } from "@/components/TestEditor";
=======
import { TestEditor } from "@/components/assessments/TestEditor";
>>>>>>> new-cbt
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
<<<<<<< HEAD

	return (
		<Layout>
			<div className="flex h-[calc(100vh-3rem)] flex-col overflow-y-auto">
				<TestEditor
					assessmentUuid={assessmentId}
					classId={Number(classId)}
					subjectId={Number(subjectId)}
					backHref={`/classes/${classId}/subjects/${subjectId}/assessments`}
				/>
			</div>
=======

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
>>>>>>> new-cbt
		</Layout>
	);
}

"use client";

import { use } from "react";
import { TestEditor } from "@/components/TestEditor";
import Layout from "@/components/Layout";

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
		</Layout>
	);
}

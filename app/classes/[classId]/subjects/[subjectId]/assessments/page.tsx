"use client";

import { use } from "react";
import { TestListView } from "@/components/TestListView";
import Layout from "@/components/Layout";

export default function AssessmentsPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string }>;
}) {
	const { classId, subjectId } = use(params);

	return (
		<Layout href={`/classes/${classId}/subjects/${subjectId}`}>
			<TestListView
				subjectId={Number(subjectId)}
				classId={Number(classId)}
			/>
		</Layout>
	);
}

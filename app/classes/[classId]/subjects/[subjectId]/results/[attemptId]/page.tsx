"use client";

import Layout from "@/components/Layout";
// import { BackButton } from "@/components/PageHeader";
import { GradeAttemptView } from "@/GradeAttemptView";
import { useCBTStore } from "@/store";
import { use } from "react";

export default function GradeAttemptPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string; attemptId: string }>;
}) {
	const { classId, subjectId, attemptId } = use(params);
	const attempt = useCBTStore((s) =>
		s.attempts.find((a) => a.id === attemptId),
	);

	if (!attempt) {
		return (
			<Layout>
				<p className="text-sm text-gray-400 text-center py-20">
					Attempt not found
				</p>
			</Layout>
		);
	}

	return (
		<GradeAttemptView
			attempt={attempt}
			classId={classId}
			subjectId={subjectId}
		/>
	);
}

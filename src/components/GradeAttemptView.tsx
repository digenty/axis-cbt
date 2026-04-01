"use client";

import { useCBTStore } from "@/store";
import { use } from "react";
import { BackButton } from "./PageHeader";
import { GradeAttemptView } from "@/GradeAttemptView";

export default function GradeAttemptsView({
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
			<div>
				<BackButton
					href={`/classes/${classId}/subjects/${subjectId}/results`}
				/>
				<p className="text-sm text-gray-400 text-center py-20">
					Attempt not found
				</p>
			</div>
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

"use client";
import { use } from "react";
import { useCBTStore } from "@/store";
import { BackButton } from "@/components/PageHeader";
import { TestEditor } from "@/components/TestEditor";

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
	const test = useCBTStore((s) => s.tests.find((t) => t.id === assessmentId));
	const cls = useCBTStore((s) => s.classes.find((c) => c.id === classId));
	const subject = useCBTStore((s) =>
		s.subjects.find((sub) => sub.id === subjectId),
	);

	if (!test) {
		return (
			<div>
				<BackButton
					href={`/classes/${classId}/subjects/${subjectId}/assessments`}
				/>
				<p className="py-20 text-center text-sm text-gray-400">
					Test not found
				</p>
			</div>
		);
	}

	return (
		<div className="p-8">
			<BackButton
				href={`/classes/${classId}/subjects/${subjectId}/assessments`}
			/>
			<TestEditor
				test={test}
				classId={classId}
				className={cls?.name || classId}
				subjectName={subject?.name || subjectId}
			/>
		</div>
	);
}

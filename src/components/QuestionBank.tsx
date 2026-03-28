"use client";

import { use } from "react";
import { useCBTStore } from "@/store";
import { QuestionBankView } from "./QuestionBankView";
import { BackButton } from "./PageHeader";

export default function QuestionBank({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) {
	const { classId, subjectId } = use(params);
	const subject = useCBTStore((s) =>
		s.subjects.find((sub) => sub.id === subjectId),
	);
	const cls = useCBTStore((s) => s.classes.find((c) => c.id === classId));

	return (
		<div className="flex h-[calc(100vh-3rem)] flex-col p-8">
			<BackButton href={`/classes/${classId}/subjects/${subjectId}`} />
			<div className="mb-4">
				<h1 className="text-base font-semibold text-gray-900">
					Question Bank
				</h1>
				<p className="mt-0.5 text-xs text-gray-400">
					{cls?.name} - {subject?.name}
				</p>
			</div>
			<div className="flex-1 overflow-hidden">
				<QuestionBankView subjectId={subjectId} />
			</div>
		</div>
	);
}

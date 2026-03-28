"use client";

import { use } from "react";
import { BarChart3 } from "lucide-react";
import { BackButton } from "./PageHeader";

export default function Results({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) {
	const { classId, subjectId } = use(params);

	return (
		<div>
			<BackButton href={`/classes/${classId}/subjects/${subjectId}`} />
			<h1 className="mb-6 text-base font-semibold text-gray-900">Results</h1>
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50">
					<BarChart3 className="h-6 w-6 text-purple-500" />
				</div>
				<p className="mb-1 text-sm font-medium text-gray-600">
					No results yet
				</p>
				<p className="max-w-xs text-xs text-gray-400">
					Results from completed assessments will appear here
				</p>
			</div>
		</div>
	);
}

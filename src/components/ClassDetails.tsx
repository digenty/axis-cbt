"use client";

import { useCBTStore } from "@/store";
import { use } from "react";
import { ClassSubjectsView } from "./ClassSubjectsView";
import Layout from "./Layout";

const ClassDetails = ({
	params,
}: Readonly<{
	params: Promise<{ classId: string }>;
}>) => {
	const { classId } = use(params);
	const cls = useCBTStore((s) => s.classes.find((c) => c.id === classId));

	return (
		<Layout href="/subjects">
			<div className="mb-5">
				<h1 className="text-lg font-semibold text-gray-900">
					{cls?.name || classId}
				</h1>
				<p className="mt-0.5 text-sm text-gray-500">{cls?.school}</p>
			</div>
			<ClassSubjectsView classId={classId} />
		</Layout>
	);
};

export default ClassDetails;

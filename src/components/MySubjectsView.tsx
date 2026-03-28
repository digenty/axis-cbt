"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Subject } from "@/types";
import { useCBTStore } from "@/store";
import { Button, Skeleton } from "./ui";
// import { useBreadcrumbStore } from "@/store/breadcrumb";
// import { useSearchParams } from "next/navigation";

function groupByName(subjects: Subject[]): Record<string, Subject[]> {
	return subjects.reduce(
		(acc, s) => {
			if (!acc[s.name]) acc[s.name] = [];
			acc[s.name].push(s);
			return acc;
		},
		{} as Record<string, Subject[]>,
	);
}

export const MySubjectsView = () => {
	const { subjects } = useCBTStore();
	const [loading, setLoading] = useState(true);
	// const params = useSearchParams();
	// const activeTab = params.get("tab") ?? "subjects";
	// const { setBreadcrumbs } = useBreadcrumbStore();

	useEffect(() => {
		const t = setTimeout(() => setLoading(false), 600);
		return () => clearTimeout(t);
	}, []);

	// useEffect(() => {
	//   setBreadcrumbs([
	//     { label: "CBT Subjects", url: "/subjects" },
	//     {
	//       label: "My Classes",
	//       url: `/subjects${showTabs ? `?tab=${activeTab}` : ""}`,
	//     },
	//   ]);
	// }, [activeTab, showTabs, hasSubjects, setBreadcrumbs]);

	const grouped = groupByName(subjects);

	if (loading) {
		return (
			<div className="space-y-4 p-8">
				<Skeleton className="h-6 w-32" />
				{[1, 2].map((i) => (
					<div
						key={i}
						className="overflow-hidden rounded-xl border border-gray-200"
					>
						<div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
							<Skeleton className="h-4 w-24" />
						</div>
						{[1, 2, 3].map((j) => (
							<div
								key={j}
								className="flex items-center justify-between border-b border-gray-50 px-4 py-3"
							>
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-8 w-24 rounded-lg" />
							</div>
						))}
					</div>
				))}
			</div>
		);
	}

	if (Object.keys(grouped).length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 py-20 text-center">
				<BookOpen className="mb-4 h-12 w-12 text-gray-200" />
				<p className="text-sm font-medium text-gray-500">
					No subjects assigned
				</p>
				<p className="mt-1 text-xs text-gray-400">
					Subjects assigned to you will appear here
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-5 p-8">
			<h2 className="text-base font-semibold text-gray-900">My Subjects</h2>
			{Object.entries(grouped).map(([subjectName, subjectList]) => (
				<SubjectGroup
					key={subjectName}
					name={subjectName}
					subjects={subjectList}
				/>
			))}
		</div>
	);
};

const SubjectGroup = ({
	name,
	subjects,
}: {
	name: string;
	subjects: Subject[];
}) => (
	<div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
		<div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
			<h3 className="text-sm font-semibold text-gray-800">{name}</h3>
		</div>
		<div className="divide-y divide-gray-50">
			{subjects.map((subject) => (
				<SubjectRow key={subject.id} subject={subject} />
			))}
		</div>
	</div>
);

const SubjectRow = ({ subject }: { subject: Subject }) => {
	console.log({ subject });
	const cls = useCBTStore((s) =>
		s.classes.find((c) => c.id === subject.classId),
	);

	return (
		<div className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50/60">
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
					<BookOpen className="h-4 w-4 text-blue-500" />
				</div>
				<div>
					<p className="text-sm font-medium text-gray-800">
						{cls?.name || "Unknown Class"}
					</p>
				</div>
			</div>
			<Link href={`/classes/${subject?.classId}/subjects/${subject?.id}`}>
				<Button size="sm" variant="primary">
					View Subject
					<ChevronRight className="h-3 w-3" />
				</Button>
			</Link>
		</div>
	);
};

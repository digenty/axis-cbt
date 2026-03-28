"use client";

import Link from "next/link";
import { BookOpen, ClipboardList, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCBTStore } from "@/store";

interface SubjectDetailViewProps {
	classId: string;
	subjectId: string;
}

const FEATURES = [
	{
		key: "question-bank",
		icon: BookOpen,
		title: "Question Bank",
		description: "Create and manage reusable questions",
		iconBg: "bg-green-100",
		iconColor: "text-green-600",
		borderHover: "hover:border-green-200",
	},
	{
		key: "assessments",
		icon: ClipboardList,
		title: "Assessments",
		description: "Create, manage and assign assessments",
		iconBg: "bg-blue-100",
		iconColor: "text-blue-600",
		borderHover: "hover:border-blue-200",
	},
	{
		key: "results",
		icon: BarChart3,
		title: "Results",
		description: "View test results and analytics",
		iconBg: "bg-purple-100",
		iconColor: "text-purple-600",
		borderHover: "hover:border-purple-200",
	},
];

export const SubjectDetailView = ({
	classId,
	subjectId,
}: SubjectDetailViewProps) => {
	const subject = useCBTStore((s) =>
		s.subjects.find((sub) => sub.id === subjectId),
	);
	const cls = useCBTStore((s) => s.classes.find((c) => c.id === classId));

	if (!subject || !cls) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-sm text-gray-400">Subject not found</p>
			</div>
		);
	}

	return (
		<div>
			<div className="mt-2 grid grid-cols-3 gap-4">
				{FEATURES.map((feature) => {
					const Icon = feature.icon;
					const href = `/classes/${classId}/subjects/${subjectId}/${feature.key}`;

					return (
						<Link key={feature.key} href={href}>
							<div
								className={cn(
									"cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md",
									feature.borderHover,
								)}
							>
								<div
									className={cn(
										"mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
										feature.iconBg,
									)}
								>
									<Icon className={cn("h-5 w-5", feature.iconColor)} />
								</div>
								<h3 className="mb-1 text-sm font-semibold text-gray-900">
									{feature.title}
								</h3>
								<p className="text-xs text-gray-500">
									{feature.description}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { QuestionType } from "@/types";
import clsx from "clsx";
import { Modal } from "./Modal";

interface AddAssessmentItemModalProps {
	open: boolean;
	onClose: () => void;
	onSelectType: (type: QuestionType) => void;
	onSelectGroup: () => void;
	onSelectMultipleBlanks: () => void;
	onSelectMatch: () => void;
}

// ─── Item type config ─────────────────────────────────────────────────────────
const SINGLE_QUESTION_TYPES: { type: QuestionType; label: string }[] = [
	{ type: "multiple-choice", label: "MCQ" },
	{ type: "true-false", label: "True/False" },
	{ type: "essay", label: "Essay" },
	{ type: "fill-in-blank", label: "Fill-in-the-Blank" },
	{ type: "short-answer", label: "Short Answer" },
	{ type: "multiple-answers", label: "Multiple Answers" },
	{ type: "numerical", label: "Numeric Answers" },
];

const ITEM_TYPES = [
	{
		id: "single",
		icon: "🟠",
		iconBg: "bg-orange-100",
		title: "Single Question",
		description: "For standalone assessment items",
		tags: [
			"MCQ",
			"True/False",
			"Essay",
			"Fill-in-the-Blank",
			"Short Answer",
			"Multiple Answers",
			"Numeric Answers",
		],
	},
	{
		id: "group",
		icon: "🟢",
		iconBg: "bg-green-100",
		title: "Question Groups (Shared Material)",
		description: "For multiple questions about the same stimulus",
		tags: ["Comprehension Passage", "Diagram", "Table", "Chart"],
	},
	{
		id: "blanks",
		icon: "🔵",
		iconBg: "bg-blue-100",
		title: "Multiple Blanks",
		description:
			"Write naturally and insert blanks where students fill in answers",
		tags: ["Multiple blanks"],
	},
	{
		id: "match",
		icon: "🔴",
		iconBg: "bg-red-100",
		title: "Match",
		description: "Match choices to options",
		tags: ["Match"],
	},
] as const;

type ItemTypeId = (typeof ITEM_TYPES)[number]["id"];

export const AddAssessmentItemModal = ({
	open,
	onClose,
	onSelectType,
	onSelectGroup,
	onSelectMultipleBlanks,
	onSelectMatch,
}: AddAssessmentItemModalProps) => {
	const [expandedId, setExpandedId] = useState<ItemTypeId | null>(null);

	const handleItemClick = (id: ItemTypeId) => {
		if (id === "single") {
			setExpandedId(expandedId === "single" ? null : "single");
		} else if (id === "group") {
			onClose();
			onSelectGroup();
		} else if (id === "blanks") {
			onClose();
			onSelectMultipleBlanks();
		} else if (id === "match") {
			onClose();
			onSelectMatch();
		}
	};

	const handleSelectSingleType = (type: QuestionType) => {
		onClose();
		setExpandedId(null);
		onSelectType(type);
	};

	return (
		<Modal
			open={open}
			onClose={() => {
				onClose();
				setExpandedId(null);
			}}
			className="max-h-[90vh] overflow-y-auto"
			// showCloseButton={false}
			title="Add Assessment Item"
			subtitle="Choose the type of item you want to add to the Question Bank"
			// size="lg"
		>
			<div className="space-y-2 px-5 py-4">
				{ITEM_TYPES.map((item) => (
					<div key={item.id}>
						<button
							onClick={() => handleItemClick(item.id)}
							className={clsx(
								"flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all",
								expandedId === item.id
									? "border-blue-300 bg-blue-50/50 ring-1 ring-blue-200"
									: "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
							)}
						>
							{/* Icon */}
							<div
								className={clsx(
									"mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg",
									item.iconBg,
								)}
							>
								{item.icon}
							</div>

							{/* Text */}
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between">
									<span className="text-sm font-semibold text-gray-900">
										{item.title}
									</span>
									{item.id !== "single" && (
										<ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
									)}
								</div>
								<p className="mt-0.5 text-xs text-gray-500">
									{item.description}
								</p>
								<div className="mt-2 flex flex-wrap gap-1.5">
									{item.tags.map((tag) => (
										<span
											key={tag}
											className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						</button>

						{/* Expanded: single question type picker */}
						{item.id === "single" && expandedId === "single" && (
							<div className="mt-2 ml-12 pl-1">
								<p className="mb-2 text-xs font-medium text-gray-600">
									Select Question Type
								</p>
								<div className="flex flex-wrap gap-2">
									{SINGLE_QUESTION_TYPES.map(({ type, label }) => (
										<button
											key={type}
											onClick={() => handleSelectSingleType(type)}
											className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
										>
											{label}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</Modal>
	);
};

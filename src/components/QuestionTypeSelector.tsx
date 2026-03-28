"use client";
import { QuestionType } from "@/types";
import { cn, getQuestionTypeLabel } from "@/lib/utils";

interface QuestionTypeSelectorProps {
	selected: QuestionType;
	onChange: (type: QuestionType) => void;
}

const QUESTION_TYPES: { type: QuestionType; description: string }[] = [
	{
		type: "multiple-choice",
		description: "Single correct answer from options",
	},
	{ type: "multiple-answers", description: "Multiple correct answers" },
	{ type: "true-false", description: "True or False answer" },
	{ type: "fill-in-blank", description: "Fill in the blank" },
	{ type: "short-answer", description: "Brief text response" },
	{ type: "essay", description: "Long-form written response" },
	{ type: "numerical", description: "Numerical answer" },
	{ type: "matching", description: "Match items in two columns" },
	{ type: "question-group", description: "Group with shared passage" },
	{ type: "multiple-blanks", description: "Text with multiple blanks" },
];

export const QuestionTypeSelector = ({
	selected,
	onChange,
}: QuestionTypeSelectorProps) => {
	return (
		<div className="grid grid-cols-2 gap-2">
			{QUESTION_TYPES.map(({ type, description }) => (
				<button
					key={type}
					type="button"
					onClick={() => onChange(type)}
					className={cn(
						"flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-all",
						selected === type
							? "border-blue-500 bg-blue-50 text-blue-700"
							: "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
					)}
				>
					<span className="text-xs font-medium">
						{getQuestionTypeLabel(type)}
					</span>
					<span className="mt-0.5 text-xs leading-tight text-gray-400">
						{description}
					</span>
				</button>
			))}
		</div>
	);
};

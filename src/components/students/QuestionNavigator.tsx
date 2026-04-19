"use client";

import { cn } from "@/lib/utils";
import type { TakerSection, AnswerMap } from "@/types/students";

interface Props {
	sections: TakerSection[];
	answers: AnswerMap;
	currentSectionIdx: number;
	onJump: (sectionIdx: number, questionIdx: number) => void;
}

export const QuestionNavigator = ({ sections, answers, currentSectionIdx, onJump }: Props) => {
	let globalIdx = 0;

	return (
		<aside className="flex w-52 shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white px-4 py-5">
			<p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
				Question Navigator
			</p>

			{sections.map((section, sIdx) => {
				const sectionStartIdx = globalIdx;
				const questionNumbers = section.questions.map((_, qIdx) => {
					const num = globalIdx + 1;
					globalIdx++;
					return { num, qIdx };
				});

				return (
					<div key={section.id} className="mb-4">
						<p className="mb-2 text-xs font-semibold text-gray-700">
							{section.title.replace(/\s*\(.*\)/, "")}
						</p>
						<div className="grid grid-cols-4 gap-1">
							{questionNumbers.map(({ num, qIdx }) => {
								const qId = section.questions[qIdx].id;
								const isAnswered = qId in answers && answers[qId] !== "" && (Array.isArray(answers[qId]) ? (answers[qId] as string[]).length > 0 : true);
								const isCurrent = sIdx === currentSectionIdx;

								return (
									<button
										key={num}
										onClick={() => onJump(sIdx, qIdx)}
										className={cn(
											"flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors",
											isAnswered
												? "bg-blue-600 text-white"
												: isCurrent
												? "border border-blue-200 bg-blue-50 text-blue-600"
												: "border border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100",
										)}
									>
										{num}
									</button>
								);
							})}
						</div>
					</div>
				);

				// suppress unused warning — globalIdx is mutated in the map above
				void sectionStartIdx;
			})}
		</aside>
	);
};

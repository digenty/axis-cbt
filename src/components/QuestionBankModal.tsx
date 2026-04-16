"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, Eye } from "lucide-react";
import { Modal } from "./Modal";
import { useGetTopics, useGetQuestions } from "@/hooks/queryHooks/useQuestionBank";
import type { ApiQuestion } from "@/types/question";

// ─── Type label map ───────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
	MULTIPLE_CHOICE: "MCQ",
	TRUE_FALSE: "TRUE / FALSE",
	SHORT_ANSWER: "SHORT ANSWER",
	FILL_IN_THE_BLANK: "FILL-IN-BLANK",
	QUESTION_GROUP: "GROUP",
	MATCH: "MATCH",
	MULTIPLE_ANSWERS: "MULTIPLE ANSWERS",
	NUMERIC_ANSWER: "NUMERIC ANSWER",
	ESSAY: "ESSAY",
	COMPREHENSION: "PASSAGE",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface SelectFromQuestionBankModalProps {
	open: boolean;
	classId: number;
	subjectId: number;
	/** Already-added question IDs (numbers) — these show as disabled */
	alreadySelectedIds: number[];
	onClose: () => void;
	onAdd: (questionIds: number[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SelectFromQuestionBankModal = ({
	open,
	classId,
	subjectId,
	alreadySelectedIds,
	onClose,
	onAdd,
}: SelectFromQuestionBankModalProps) => {
	const [search, setSearch] = useState("");
	const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	const { data: topicsRes } = useGetTopics({ classId, subjectId });
	const topics = topicsRes?.data ?? [];

	const activeTopicId = selectedTopicId ?? (topics[0]?.id ?? null);

	const { data: questionsRes, isLoading: loadingQuestions } = useGetQuestions({
		classId,
		subjectId,
		topicId: activeTopicId ?? undefined,
	});

	const visibleQuestions = useMemo(() => {
		const allQuestions: ApiQuestion[] = questionsRes?.data ?? [];
		if (!search) return allQuestions;
		return allQuestions.filter((q) =>
			q.questionText.toLowerCase().includes(search.toLowerCase()),
		);
	}, [questionsRes, search]);

	const toggleSelect = (id: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const handleAdd = () => {
		onAdd(Array.from(selectedIds));
		setSelectedIds(new Set());
		setSearch("");
		onClose();
	};

	const handleClose = () => {
		setSelectedIds(new Set());
		setSearch("");
		onClose();
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title="Select from Question Bank"
			className="max-h-[90vh] overflow-y-auto"
			subtitle={`${selectedIds.size} question${selectedIds.size !== 1 ? "s" : ""} selected`}
			footer={
				<div className="flex items-center justify-between px-5 pb-5">
					<button
						onClick={handleClose}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={handleAdd}
						disabled={selectedIds.size === 0}
						className={cn(
							"flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
							selectedIds.size > 0
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "cursor-not-allowed bg-gray-100 text-gray-400",
						)}
					>
						Add Questions
						{selectedIds.size > 0 && (
							<span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
								{selectedIds.size}
							</span>
						)}
					</button>
				</div>
			}
		>
			<div className="flex flex-col">
				{/* Search */}
				<div className="border-b border-gray-100 px-5 pt-4 pb-3">
					<div className="relative">
						<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search questions"
							className="h-9 w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
				</div>

				{/* Topic tabs */}
				{topics.length > 0 && (
					<div className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-gray-100 px-5 py-3">
						{topics.map((t) => (
							<button
								key={t.id}
								onClick={() => setSelectedTopicId(t.id)}
								className={cn(
									"rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
									activeTopicId === t.id
										? "bg-blue-600 text-white"
										: "text-gray-600 hover:bg-gray-100",
								)}
							>
								{t.name}
							</button>
						))}
					</div>
				)}

				{/* Question list */}
				<div className="max-h-[420px] overflow-y-auto">
					{loadingQuestions ? (
						<div className="space-y-2 p-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-12 animate-pulse rounded-lg bg-gray-100"
								/>
							))}
						</div>
					) : visibleQuestions.length === 0 ? (
						<div className="flex items-center justify-center py-12 text-sm text-gray-400">
							No questions found
						</div>
					) : (
						<table className="w-full">
							<tbody className="divide-y divide-gray-100">
								{visibleQuestions.map((q) => {
									const isAlready = alreadySelectedIds.includes(q.id);
									const isSelected = selectedIds.has(q.id);
									return (
										<tr
											key={q.id}
											className={cn(
												"transition-colors",
												isAlready
													? "cursor-not-allowed opacity-40"
													: "cursor-pointer hover:bg-gray-50",
											)}
											onClick={() => !isAlready && toggleSelect(q.id)}
										>
											<td className="w-10 py-3.5 pr-3 pl-5">
												<input
													type="checkbox"
													checked={isSelected}
													disabled={isAlready}
													onChange={() => !isAlready && toggleSelect(q.id)}
													onClick={(e) => e.stopPropagation()}
													className="h-4 w-4 cursor-pointer accent-blue-600"
												/>
											</td>
											<td className="w-36 py-3.5 pr-4">
												<span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
													{TYPE_LABELS[q.questionType] ??
														q.questionType}
												</span>
											</td>
											<td className="py-3.5 pr-4">
												<p className="line-clamp-1 text-sm text-gray-800">
													{q.questionText}
												</p>
											</td>
											<td className="py-3.5 pr-3 text-right whitespace-nowrap">
												<span className="text-sm text-gray-500">
													{q.marks} mark{q.marks !== 1 ? "s" : ""}
												</span>
											</td>
											<td className="w-10 py-3.5 pr-5">
												<button
													onClick={(e) => e.stopPropagation()}
													className="text-gray-400 transition-colors hover:text-gray-600"
													title="Preview"
												>
													<Eye className="h-4 w-4" />
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</Modal>
	);
};

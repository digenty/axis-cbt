"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StudentAttempt, StudentAnswer, Question } from "@/types";
import { cn } from "@/lib/utils";
import { Flag, ChevronRight, RotateCcw } from "lucide-react";
import { useCBTStore } from "@/store";
import { Modal } from "@/components/Modal";
import Layout from "@/components/Layout";

// ─── Demo test sections (mirrors what the test editor would store) ────────────
const DEMO_SECTIONS = [
	{
		id: "sec-a",
		title: "Section A (Comprehension)",
		instruction: "",
		questionIds: ["q-comp-group"], // question-group with passage
	},
	{
		id: "sec-b",
		title: "Section B",
		instruction: "",
		questionIds: ["q1", "q2", "q3", "q4", "q5", "q7", "q8", "q9"],
	},
	{
		id: "sec-c",
		title: "Section C",
		instruction: "",
		questionIds: ["q-blanks"],
	},
];

interface GradeAttemptViewProps {
	attempt: StudentAttempt;
	classId: string;
	subjectId: string;
}

export const GradeAttemptView = ({
	attempt,
	classId,
	subjectId,
}: GradeAttemptViewProps) => {
	const router = useRouter();
	const { questions: allQuestions, tests, gradeAttempt } = useCBTStore();
	const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
	const [gradeModalOpen, setGradeModalOpen] = useState(false);
	const [answers, setAnswers] = useState<StudentAnswer[]>(
		attempt.answers || [],
	);
	const [awardedMarks, setAwardedMarks] = useState<Record<string, number>>(
		() => {
			const m: Record<string, number> = {};
			(attempt.answers || []).forEach((a) => {
				if (a.awardedMarks !== undefined) m[a.questionId] = a.awardedMarks;
			});
			return m;
		},
	);

	// Get test (real or demo)
	const test = tests.find((t) => t.id === attempt.testId);
	const sections = test?.sections?.length ? test.sections : DEMO_SECTIONS;
	const totalSections = sections.length;
	const currentSection = sections[currentSectionIdx];

	// Flatten all question IDs across all sections for navigator
	const allQuestionIds = sections.flatMap((s) => s.questionIds);
	console.log({ allQuestionIds });

	// Get questions for current section
	const getSectionQuestions = (sec: (typeof sections)[0]): Question[] => {
		return sec.questionIds
			.map((id) => allQuestions.find((q) => q.id === id))
			.filter(Boolean) as Question[];
	};

	// Cumulative index for Q numbering
	const sectionStartIdx = sections
		.slice(0, currentSectionIdx)
		.reduce((acc, s) => acc + s.questionIds.length, 0);

	const sectionQuestions = getSectionQuestions(currentSection);
	const answeredCount = sectionQuestions.filter((q) =>
		answers.some(
			(a) =>
				a.questionId === q.id &&
				((a.selectedOptionIds && a.selectedOptionIds.length > 0) ||
					a.textAnswer ||
					a.matchAnswers ||
					a.blankAnswers),
		),
	).length;

	const updateAnswer = useCallback(
		(qId: string, patch: Partial<StudentAnswer>) => {
			setAnswers((prev) => {
				const existing = prev.find((a) => a.questionId === qId);
				if (existing)
					return prev.map((a) =>
						a.questionId === qId ? { ...a, ...patch } : a,
					);
				return [...prev, { questionId: qId, ...patch }];
			});
		},
		[],
	);

	const setMark = (qId: string, mark: number) => {
		setAwardedMarks((prev) => ({ ...prev, [qId]: mark }));
		updateAnswer(qId, { awardedMarks: mark });
	};

	// Total auto-calculated score
	const totalScore = Object.values(awardedMarks).reduce((s, m) => s + m, 0);
	const totalPossible = attempt.totalMarks || 100;

	// Has passage (question-group with passage text)
	const firstQ = sectionQuestions[0];
	const hasPassage = firstQ?.type === "question-group" && firstQ.passage;
	const passageImage = firstQ?.type === "question-group" && !firstQ.passage;

	return (
		<Layout>
			<div className="flex flex-col h-screen bg-white overflow-hidden">
				{/* Top bar */}
				<div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
					<h1 className="text-base font-bold text-gray-900">
						{test?.title || "Mid-Term Mathematics Test"}
					</h1>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
								<span className="text-xs font-bold text-gray-600">
									{attempt.studentName
										.split(" ")
										.map((n) => n[0])
										.join("")
										.slice(0, 2)}
								</span>
							</div>
							<div>
								<p className="text-sm font-semibold text-gray-900 leading-tight">
									{attempt.studentName}
								</p>
								<p className="text-xs text-gray-400 leading-tight">
									{attempt.studentClass}
								</p>
							</div>
						</div>
						<button
							onClick={() => setGradeModalOpen(true)}
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
						>
							Grade
						</button>
					</div>
				</div>

				<div className="flex flex-1 overflow-hidden">
					{/* Left: Question Navigator */}
					<aside className="w-36 shrink-0 border-r border-gray-100 overflow-y-auto py-4 px-3">
						<p className="text-xs font-semibold text-gray-500 mb-3">
							Question Navigator
						</p>
						{sections.map((sec, sIdx) => {
							const startIdx = sections
								.slice(0, sIdx)
								.reduce((a, s) => a + s.questionIds.length, 0);
							return (
								<div key={sec.id} className="mb-4">
									<button
										onClick={() => setCurrentSectionIdx(sIdx)}
										className={cn(
											"text-xs font-semibold mb-2 leading-tight text-left",
											sIdx === currentSectionIdx
												? "text-blue-600"
												: "text-gray-500",
										)}
									>
										{sec.title}
									</button>
									<div className="grid grid-cols-4 gap-1">
										{sec.questionIds.map((qId, qIdx) => {
											const globalIdx = startIdx + qIdx + 1;
											const isActive = sIdx === currentSectionIdx;
											const isAnswered = answers.some(
												(a) =>
													a.questionId === qId &&
													(a.selectedOptionIds?.length ||
														a.textAnswer ||
														a.matchAnswers ||
														a.blankAnswers),
											);
											return (
												<button
													key={qId}
													onClick={() =>
														setCurrentSectionIdx(sIdx)
													}
													className={cn(
														"w-7 h-7 text-xs rounded flex items-center justify-center font-medium transition-colors",
														isActive && qIdx === 0
															? "bg-blue-600 text-white"
															: isAnswered
																? "bg-gray-800 text-white"
																: "bg-gray-100 text-gray-600 hover:bg-gray-200",
													)}
												>
													{globalIdx}
												</button>
											);
										})}
									</div>
								</div>
							);
						})}
					</aside>

					{/* Main content */}
					<div className="flex-1 overflow-hidden flex flex-col">
						{/* Section heading */}
						<div className="px-6 pt-5 pb-3 border-b border-gray-100 shrink-0">
							<h2 className="text-base font-bold text-gray-900">
								{currentSection.title}
							</h2>
							{currentSection.instruction && (
								<p className="text-xs text-gray-400 mt-0.5">
									{currentSection.instruction}
								</p>
							)}
							{!currentSection.instruction && (
								<p className="text-xs text-gray-300 mt-0.5">
									Instructions (optional)
								</p>
							)}
						</div>

						{/* Scrollable body */}
						<div className="flex-1 overflow-y-auto">
							{/* Split layout when there's a passage or image material */}
							{hasPassage || passageImage ? (
								<div className="flex h-full">
									{/* Left: passage / image */}
									<div className="w-[42%] border-r border-gray-100 overflow-y-auto px-6 py-5 text-sm text-gray-700 leading-relaxed text-justify">
										{hasPassage ? (
											<>
												{firstQ.text && (
													<h3 className="text-base font-bold text-gray-900 mb-3">
														{firstQ.text}
													</h3>
												)}
												<div
													className="prose prose-sm max-w-none"
													dangerouslySetInnerHTML={{
														__html: firstQ.passage || "",
													}}
												/>
												{!firstQ.passage && (
													<p className="whitespace-pre-wrap">
														{DEMO_PASSAGE}
													</p>
												)}
											</>
										) : (
											<div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 border border-gray-200">
												<div className="flex flex-col items-center gap-2">
													<svg
														className="w-8 h-8"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<rect
															x="3"
															y="3"
															width="18"
															height="18"
															rx="2"
															strokeWidth="1.5"
														/>
														<path
															d="M3 9h18M9 3v18"
															strokeWidth="1.5"
														/>
													</svg>
													<span className="text-xs">
														Upload Image
													</span>
												</div>
											</div>
										)}
										{firstQ.instruction && (
											<p className="text-xs text-gray-400 mt-3 italic">
												{firstQ.instruction}
											</p>
										)}
									</div>

									{/* Right: questions */}
									<div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
										<p className="text-xs text-gray-500 mb-2">
											{firstQ.instruction ||
												"Answer the following questions"}
										</p>
										{(firstQ.subQuestions?.length
											? firstQ.subQuestions
											: sectionQuestions
										).map((q: Question, idx: number) => (
											<QuestionCard
												key={q.id}
												question={q}
												number={sectionStartIdx + idx + 1}
												answer={answers.find(
													(a) => a.questionId === q.id,
												)}
												awardedMark={awardedMarks[q.id]}
												onAnswerChange={(patch) =>
													updateAnswer(q.id, patch)
												}
												onMarkChange={(m) => setMark(q.id, m)}
											/>
										))}
									</div>
								</div>
							) : (
								/* No passage: full-width single column */
								<div className="px-6 py-5 space-y-5 max-w-3xl mx-auto">
									{sectionQuestions.map((q, idx) => (
										<QuestionCard
											key={q.id}
											question={q}
											number={sectionStartIdx + idx + 1}
											answer={answers.find(
												(a) => a.questionId === q.id,
											)}
											awardedMark={awardedMarks[q.id]}
											onAnswerChange={(patch) =>
												updateAnswer(q.id, patch)
											}
											onMarkChange={(m) => setMark(q.id, m)}
										/>
									))}
								</div>
							)}
						</div>

						{/* Bottom navigation */}
						<div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white shrink-0">
							<button
								onClick={() =>
									setCurrentSectionIdx((i) => Math.max(0, i - 1))
								}
								disabled={currentSectionIdx === 0}
								className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
							>
								Previous Section
							</button>
							<div className="text-center">
								<p className="text-xs text-gray-500">
									Section {currentSectionIdx + 1} of {totalSections}
								</p>
								<p className="text-xs text-blue-600 font-medium">
									{answeredCount} / {sectionQuestions.length} answered
								</p>
							</div>
							<button
								onClick={() => {
									if (currentSectionIdx < totalSections - 1) {
										setCurrentSectionIdx((i) => i + 1);
									} else {
										setGradeModalOpen(true);
									}
								}}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-40"
							>
								{currentSectionIdx < totalSections - 1
									? "Next Section"
									: "Finish & Grade"}
							</button>
						</div>
					</div>
				</div>

				{/* Total Score Modal */}
				<TotalScoreModal
					open={gradeModalOpen}
					studentName={attempt.studentName}
					testTitle={test?.title || "Mathematics Test"}
					score={totalScore}
					totalMarks={totalPossible}
					onClose={() => setGradeModalOpen(false)}
					onUpload={async (feedback) => {
						const finalAnswers = answers.map((a) => ({
							...a,
							awardedMarks: awardedMarks[a.questionId] ?? a.awardedMarks,
						}));
						gradeAttempt(attempt.id, totalScore, feedback, finalAnswers);
						router.push(
							`/classes/${classId}/subjects/${subjectId}/results`,
						);
					}}
				/>
			</div>
		</Layout>
	);
};

// ─── Total Score Modal ────────────────────────────────────────────────────────
const TotalScoreModal = ({
	open,
	// studentName,
	testTitle,
	score,
	totalMarks,
	onClose,
	onUpload,
}: {
	open: boolean;
	studentName: string;
	testTitle: string;
	score: number;
	totalMarks: number;
	onClose: () => void;
	onUpload: (feedback: string) => Promise<void>;
}) => {
	const [feedback, setFeedback] = useState("");
	const [uploading, setUploading] = useState(false);

	const handleUpload = async () => {
		setUploading(true);
		await onUpload(feedback);
		setUploading(false);
	};

	return (
		<Modal open={open} onClose={onClose} title="Total Score" size="sm">
			<div className="px-6 py-5 space-y-4">
				<p className="text-sm text-gray-700">
					Total Score for {testTitle}:{" "}
					<span className="font-bold text-gray-900">
						{score}/{totalMarks}
					</span>
				</p>

				<div>
					<div className="flex items-center justify-between mb-1.5">
						<label className="text-sm font-medium text-gray-700">
							Feedback
						</label>
						<span className="text-xs text-gray-400">Optional</span>
					</div>
					<textarea
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						rows={4}
						className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400 bg-gray-50"
					/>
				</div>

				<div className="flex items-center justify-between pt-1">
					<button
						onClick={onClose}
						className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<RotateCcw className="w-3.5 h-3.5" />
						Return to question
					</button>
					<button
						onClick={handleUpload}
						disabled={uploading}
						className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
					>
						{uploading && (
							<span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
						)}
						Upload Result
					</button>
				</div>
			</div>
		</Modal>
	);
};

// ─── Question Card ─────────────────────────────────────────────────────────────
interface QuestionCardProps {
	question: Question;
	number: number;
	answer?: StudentAnswer;
	awardedMark?: number;
	onAnswerChange: (patch: Partial<StudentAnswer>) => void;
	onMarkChange: (mark: number) => void;
}

const QuestionCard = ({
	question,
	number,
	answer,
	awardedMark,
	onAnswerChange,
	onMarkChange,
}: QuestionCardProps) => {
	return (
		<div className="border border-gray-200 rounded-xl p-4 bg-white">
			{/* Header */}
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
							answer &&
								(answer.selectedOptionIds?.length ||
									answer.textAnswer ||
									answer.matchAnswers ||
									answer.blankAnswers)
								? "bg-gray-800 text-white"
								: "bg-gray-200 text-gray-600",
						)}
					>
						{number}
					</div>
					<span className="text-xs text-gray-400">
						{question.marks} marks
					</span>
				</div>
				<button className="text-gray-300 hover:text-gray-500 transition-colors">
					<Flag className="w-4 h-4" />
				</button>
			</div>

			{/* Question text */}
			<p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">
				{question.text}
			</p>

			{/* Type-specific answer UI */}
			{question.type === "multiple-choice" && (
				<MCQAnswer
					question={question}
					answer={answer}
					onChange={onAnswerChange}
					single
				/>
			)}
			{question.type === "multiple-answers" && (
				<MCQAnswer
					question={question}
					answer={answer}
					onChange={onAnswerChange}
					single={false}
				/>
			)}
			{question.type === "true-false" && (
				<TrueFalseAnswer
					question={question}
					answer={answer}
					onChange={onAnswerChange}
				/>
			)}
			{(question.type === "essay" || question.type === "short-answer") && (
				<EssayAnswer
					question={question}
					answer={answer}
					onChange={onAnswerChange}
					showExpected={question.type === "short-answer"}
				/>
			)}
			{question.type === "numerical" && (
				<TextAnswer
					answer={answer}
					onChange={onAnswerChange}
					placeholder="Student answer"
				/>
			)}
			{question.type === "fill-in-blank" && (
				<TextAnswer
					answer={answer}
					onChange={onAnswerChange}
					placeholder="Student answer"
				/>
			)}
			{question.type === "matching" && (
				<MatchAnswer
					question={question}
					answer={answer}
					onChange={onAnswerChange}
				/>
			)}
			{question.type === "multiple-blanks" && (
				<MultipleBlanksAnswer
					question={question}
					answer={answer}
					onChange={onAnswerChange}
				/>
			)}
			{question.type === "question-group" &&
				question.subQuestions?.map((sq, idx) => (
					<QuestionCard
						key={sq.id}
						question={sq}
						number={idx + 1}
						answer={answer}
						onAnswerChange={onAnswerChange}
						onMarkChange={onMarkChange}
					/>
				))}

			{/* Marks */}
			<div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
				<span className="text-sm text-gray-500">Marks:</span>
				<input
					type="number"
					min={0}
					max={question.marks}
					value={awardedMark ?? question.marks}
					onChange={(e) =>
						onMarkChange(
							Math.min(
								question.marks,
								Math.max(0, Number(e.target.value)),
							),
						)
					}
					className="w-14 h-7 text-sm text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
				/>
			</div>
		</div>
	);
};

// ─── MCQ Answer ───────────────────────────────────────────────────────────────
const MCQAnswer = ({
	question,
	answer,
	onChange,
	single,
}: {
	question: Question;
	answer?: StudentAnswer;
	onChange: (p: Partial<StudentAnswer>) => void;
	single: boolean;
}) => {
	const selected = answer?.selectedOptionIds || [];
	if (!single) {
		// Show instruction
	}

	const toggle = (id: string) => {
		if (single) {
			onChange({ selectedOptionIds: [id] });
		} else {
			const next = selected.includes(id)
				? selected.filter((s) => s !== id)
				: [...selected, id];
			onChange({ selectedOptionIds: next });
		}
	};

	return (
		<div className="space-y-2">
			{!single && (
				<p className="text-xs text-gray-400 mb-2">Select all that apply</p>
			)}
			{question.options?.map((opt) => {
				const isSelected = selected.includes(opt.id);
				const isCorrect = opt.isCorrect;
				const showCorrect = isSelected && isCorrect;
				const showWrong = isSelected && !isCorrect;

				return (
					<button
						key={opt.id}
						onClick={() => toggle(opt.id)}
						className={cn(
							"w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all",
							showCorrect
								? "border-green-400 bg-green-50"
								: showWrong
									? "border-red-400 bg-red-50"
									: isSelected
										? "border-blue-300 bg-blue-50"
										: "border-gray-200 bg-white hover:border-gray-300",
						)}
					>
						<div
							className={cn(
								"w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
								single ? "" : "rounded",
								showCorrect
									? "border-green-500 bg-green-500"
									: showWrong
										? "border-red-500 bg-red-500"
										: isSelected
											? "border-blue-500 bg-blue-500"
											: "border-gray-300",
							)}
						>
							{isSelected &&
								(showCorrect ? (
									<span className="text-white text-xs">✓</span>
								) : showWrong ? (
									<span className="text-white text-xs">✗</span>
								) : (
									<div className="w-2 h-2 rounded-full bg-white" />
								))}
						</div>
						<span className="text-gray-500 font-medium w-5 uppercase">
							{opt.id}.
						</span>
						<span
							className={cn(
								showCorrect
									? "text-green-800"
									: showWrong
										? "text-red-800"
										: "text-gray-800",
							)}
						>
							{opt.text}
						</span>
					</button>
				);
			})}
		</div>
	);
};

// ─── True/False Answer ────────────────────────────────────────────────────────
const TrueFalseAnswer = ({
	question,
	answer,
	onChange,
}: {
	question: Question;
	answer?: StudentAnswer;
	onChange: (p: Partial<StudentAnswer>) => void;
}) => {
	const selected = answer?.selectedOptionIds?.[0];
	return (
		<div className="flex gap-3">
			{question.options?.map((opt) => {
				const isSelected = selected === opt.id;
				const isCorrect = opt.isCorrect;
				const showCorrect = isSelected && isCorrect;
				const showWrong = isSelected && !isCorrect;
				return (
					<button
						key={opt.id}
						onClick={() => onChange({ selectedOptionIds: [opt.id] })}
						className={cn(
							"flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all justify-center",
							showCorrect
								? "border-green-400 bg-green-50 text-green-800"
								: showWrong
									? "border-red-400 bg-red-50 text-red-800"
									: isSelected
										? "border-blue-400 bg-blue-50 text-blue-800"
										: "border-gray-200 text-gray-700 hover:border-gray-300",
						)}
					>
						<div
							className={cn(
								"w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
								showCorrect
									? "border-green-500 bg-green-500"
									: showWrong
										? "border-red-500 bg-red-500"
										: isSelected
											? "border-blue-500 bg-blue-500"
											: "border-gray-300",
							)}
						>
							{isSelected && (
								<div className="w-1.5 h-1.5 rounded-full bg-white" />
							)}
						</div>
						{opt.text}
					</button>
				);
			})}
		</div>
	);
};

// ─── Essay / Short Answer ─────────────────────────────────────────────────────
const EssayAnswer = ({
	question,
	answer,
	onChange,
	showExpected,
}: {
	question: Question;
	answer?: StudentAnswer;
	onChange: (p: Partial<StudentAnswer>) => void;
	showExpected: boolean;
}) => (
	<div className="space-y-3">
		<textarea
			value={answer?.textAnswer || ""}
			onChange={(e) => onChange({ textAnswer: e.target.value })}
			rows={4}
			placeholder="Student answer"
			className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-300"
		/>
		{showExpected && question.correctAnswer && (
			<div>
				<p className="text-xs font-medium text-gray-600 mb-1">
					Expected Answer
				</p>
				<input
					readOnly
					value={
						Array.isArray(question.correctAnswer)
							? question.correctAnswer.join(", ")
							: question.correctAnswer
					}
					className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 text-gray-500"
				/>
			</div>
		)}
	</div>
);

// ─── Plain text answer ────────────────────────────────────────────────────────
const TextAnswer = ({
	answer,
	onChange,
	placeholder,
}: {
	answer?: StudentAnswer;
	onChange: (p: Partial<StudentAnswer>) => void;
	placeholder: string;
}) => (
	<input
		type="text"
		value={answer?.textAnswer || ""}
		onChange={(e) => onChange({ textAnswer: e.target.value })}
		placeholder={placeholder}
		className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-300"
	/>
);

// ─── Matching Answer ──────────────────────────────────────────────────────────
const MatchAnswer = ({
	question,
	answer,
	onChange,
}: {
	question: Question;
	answer?: StudentAnswer;
	onChange: (p: Partial<StudentAnswer>) => void;
}) => {
	const matchAnswers = answer?.matchAnswers || {};
	const items = question.matchItems || [
		{ id: "i1", text: "Choice" },
		{ id: "i2", text: "Choice" },
		{ id: "i3", text: "Choice" },
		{ id: "i4", text: "Choice" },
	];
	const options = question.matchOptions || [
		{ id: "o1", text: "Option A" },
		{ id: "o2", text: "Option B" },
		{ id: "o3", text: "Option C" },
		{ id: "o4", text: "Option D" },
	];

	return (
		<div className="space-y-2">
			{items.map((item) => (
				<div key={item.id} className="flex items-center gap-3">
					<div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
						{item.text}
					</div>
					<div className="relative">
						<select
							value={matchAnswers[item.id] || ""}
							onChange={(e) =>
								onChange({
									matchAnswers: {
										...matchAnswers,
										[item.id]: e.target.value,
									},
								})
							}
							className={cn(
								"text-sm border rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
								matchAnswers[item.id]
									? "border-green-400 bg-green-50 text-green-800"
									: "border-gray-200 bg-white text-gray-500",
							)}
						>
							<option value="">Select</option>
							{options.map((opt) => (
								<option key={opt.id} value={opt.id}>
									{opt.text}
								</option>
							))}
						</select>
						<ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none rotate-90" />
					</div>
				</div>
			))}
		</div>
	);
};

// ─── Multiple Blanks Answer ───────────────────────────────────────────────────
const MultipleBlanksAnswer = ({
	question,
	answer,
	onChange,
}: {
	question: Question;
	answer?: StudentAnswer;
	onChange: (p: Partial<StudentAnswer>) => void;
}) => {
	const blankAnswers = answer?.blankAnswers || {};
	const blanks = question.blanks || [];

	// Render the question text with inline blank widgets
	const parts = (question.text || "The man is a ___ who ___ a lot").split(
		/(\[Blank \d+\]|Blank \d+)/g,
	);
	console.log({ MultipleBlanksAnswerParts: parts });

	const updateBlank = (blankId: string, val: string | string[]) => {
		onChange({ blankAnswers: { ...blankAnswers, [blankId]: val } });
	};

	return (
		<div className="space-y-4">
			{/* Inline text with blank dropdowns/inputs */}
			<div className="text-sm leading-loose flex flex-wrap items-center gap-1">
				{blanks.length > 0 ? (
					blanks.map((blank, idx) => {
						const val = (blankAnswers[blank.id] as string) || "";
						const prevText =
							idx === 0
								? question.text?.split(/Blank \d+/)[0] || ""
								: "";
						return (
							<span
								key={blank.id}
								className="inline-flex items-center gap-1"
							>
								{idx === 0 && (
									<span className="text-gray-700">{prevText}</span>
								)}
								{blank.answerType === "multiple-choice" ? (
									<div className="relative inline-flex">
										<select
											value={val}
											onChange={(e) =>
												updateBlank(blank.id, e.target.value)
											}
											className={cn(
												"text-sm border rounded-lg px-2 py-1 pr-6 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500",
												val
													? "border-green-400 bg-green-50 text-green-800 font-medium"
													: "border-blue-300 bg-blue-50 text-blue-600",
											)}
										>
											<option value="">{`${idx + 1}  ${blank.label}`}</option>
											{blank.options?.map((opt) => (
												<option key={opt.id} value={opt.id}>
													{opt.text}
												</option>
											))}
										</select>
										<ChevronRight className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none rotate-90" />
									</div>
								) : (
									<input
										type="text"
										value={val}
										onChange={(e) =>
											updateBlank(blank.id, e.target.value)
										}
										placeholder={blank.label}
										className={cn(
											"text-sm border rounded-lg px-2 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500",
											val
												? "border-green-400 bg-green-50 text-green-800"
												: "border-blue-300 bg-blue-50",
										)}
									/>
								)}
							</span>
						);
					})
				) : (
					<span className="text-gray-700">{question.text}</span>
				)}
			</div>

			{/* Blanks config section */}
			{blanks.length > 0 && (
				<div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
					<h4 className="text-xs font-semibold text-gray-700 mb-3">
						Blanks
					</h4>
					<div className="space-y-4">
						{blanks.map((blank, idx) => {
							const val = blankAnswers[blank.id];
							return (
								<div
									key={blank.id}
									className="border border-gray-200 rounded-xl bg-white p-4"
								>
									<div className="flex items-center gap-2 mb-3">
										<div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
											{idx + 1}
										</div>
										<span className="text-sm font-medium text-gray-700">
											{blank.label}
										</span>
									</div>
									<div>
										<p className="text-xs font-medium text-gray-600 mb-1.5">
											{blank.label} Answer
										</p>
										{blank.answerType === "short-answer" ? (
											<input
												type="text"
												value={(val as string) || ""}
												onChange={(e) =>
													updateBlank(blank.id, e.target.value)
												}
												placeholder="Expected Answer"
												className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-300 bg-green-50/30"
											/>
										) : (
											<div className="space-y-2">
												{blank.options?.map((opt) => {
													const isSelected =
														val === opt.id ||
														(Array.isArray(val) &&
															val.includes(opt.id));
													const isCorrect = opt.isCorrect;
													return (
														<button
															key={opt.id}
															onClick={() =>
																updateBlank(blank.id, opt.id)
															}
															className={cn(
																"w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all",
																isSelected && isCorrect
																	? "border-green-400 bg-green-50"
																	: isSelected && !isCorrect
																		? "border-red-400 bg-red-50"
																		: "border-gray-200 hover:border-gray-300",
															)}
														>
															<div
																className={cn(
																	"w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
																	isSelected && isCorrect
																		? "border-green-500 bg-green-500"
																		: isSelected && !isCorrect
																			? "border-red-500 bg-red-500"
																			: isSelected
																				? "border-blue-500 bg-blue-500"
																				: "border-gray-300",
																)}
															>
																{isSelected && (
																	<div className="w-1.5 h-1.5 rounded-full bg-white" />
																)}
															</div>
															<span className="font-mono text-gray-400 w-4 uppercase">
																{opt.id}.
															</span>
															{opt.text}
														</button>
													);
												})}
											</div>
										)}
										<div className="flex items-center gap-2 mt-3">
											<span className="text-xs text-gray-500">
												{blank.label} Mark:
											</span>
											<span className="text-xs font-semibold text-gray-700">
												{blank.mark}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

// Demo passage text for when no passage is stored on the question
const DEMO_PASSAGE = `The Power of Urban Gardens

In many cities around the world, empty spaces between buildings are being transformed into green areas filled with vegetables, fruits, and flowers. These spaces are called urban gardens. Unlike large farms in the countryside, urban gardens are created in small plots of land, on rooftops, or even in containers placed along sidewalks. Despite their size, they have a powerful impact on communities.

Urban gardens provide fresh food to people who may not have easy access to supermarkets. In some neighborhoods, fresh fruits and vegetables are expensive or difficult to find. By growing their own tomatoes, spinach, and carrots, residents can enjoy healthier meals while saving money. This is especially important for families with limited incomes.

These gardens also bring people together. Neighbors who may not have spoken to each other before begin to share gardening tips, exchange seeds, and work side by side. Young people often learn from older gardeners who have years of experience. Through this cooperation, friendships are formed and a stronger sense of community develops.

In addition, urban gardens help the environment. Plants absorb carbon dioxide and release oxygen, improving air quality. Gardens also reduce the amount of heat in cities by providing shade and cooling the surrounding area. Furthermore, when people grow food locally, fewer trucks are needed to transport produce from distant farms, which reduces pollution.

Schools have also started creating gardens as outdoor classrooms. Students learn about biology by observing how plants grow. They practice responsibility by watering and caring for the crops. Many students say that working in the garden helps them feel calmer and more focused.

Although urban gardening requires effort, patience, and cooperation, its benefits are clear. From improving health to strengthening communities and protecting the environment, small gardens are making a big difference in cities worldwide.`;

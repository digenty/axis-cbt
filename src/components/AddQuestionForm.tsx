"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Check, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/Toast";
import {
	NormalizedQuestion,
	Option,
	QuestionType,
	SingleQuestionFormState,
} from "@/types/question.types";
import {
	useCreateCbtQuestion,
	useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import { singleQuestionToPayload } from "@/types/question.mapper";

interface AddQuestionFormProps {
	classId: number;
	subjectId: number;
	topicId: number;
	editQuestion?: NormalizedQuestion | null;
	onClose: () => void;
	onSaved: () => void;
}

const QUESTION_TYPES: { type: QuestionType; label: string }[] = [
	{ type: "multiple-choice", label: "Multiple Choice" },
	{ type: "true-false", label: "True/False" },
	{ type: "essay", label: "Essay" },
	{ type: "fill-in-blank", label: "Fill-in-the-Blank" },
	{ type: "short-answer", label: "Short Answer" },
	{ type: "multiple-answers", label: "Multiple Answers" },
	{ type: "numerical", label: "Numeric Answers" },
];

// ─── Default state builders ───────────────────────────────────────────────────

const defaultOptions = (): Option[] => [
	{ id: "a", text: "", isCorrect: false },
	{ id: "b", text: "", isCorrect: false },
	{ id: "c", text: "", isCorrect: false },
	{ id: "d", text: "", isCorrect: false },
];

const trueFalseOptions = (): Option[] => [
	{ id: "true", text: "True", isCorrect: false },
	{ id: "false", text: "False", isCorrect: false },
];

function buildDefaultForm(
	questionType: QuestionType = "multiple-choice",
	existing?: NormalizedQuestion | null,
): SingleQuestionFormState {
	if (existing) {
		return {
			questionType: existing.questionType,
			questionText: existing.questionText,
			marks: existing.marks,
			instruction: existing.instruction ?? "",
			options:
				existing.options ??
				(existing.questionType === "true-false"
					? trueFalseOptions()
					: defaultOptions()),
			correctAnswer: Array.isArray(existing.correctAnswer)
				? existing.correctAnswer.join(", ")
				: (existing.correctAnswer ?? ""),
			imageUrl: existing.imageUrl ?? null,
		};
	}
	return {
		questionType,
		questionText: "",
		marks: 1,
		instruction: "",
		options:
			questionType === "true-false" ? trueFalseOptions() : defaultOptions(),
		correctAnswer: "",
		imageUrl: null,
	};
}

// ─── Main component ───────────────────────────────────────────────────────────

export const AddQuestionForm = ({
	classId,
	subjectId,
	topicId,
	editQuestion,
	onClose,
	onSaved,
}: AddQuestionFormProps) => {
	const { mutateAsync: createQuestion } = useCreateCbtQuestion();
	const { mutateAsync: updateQuestion } = useUpdateCbtQuestion();

	const [typeDropOpen, setTypeDropOpen] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof SingleQuestionFormState, string>>
	>({});
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState<SingleQuestionFormState>(() =>
		buildDefaultForm("multiple-choice", editQuestion),
	);

	const updateField = useCallback(
		<K extends keyof SingleQuestionFormState>(
			key: K,
			val: SingleQuestionFormState[K],
		) => {
			setForm((prev) => ({ ...prev, [key]: val }));
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		},
		[],
	);

	const changeType = (type: QuestionType) => {
		setForm((prev) => ({
			...buildDefaultForm(type),
			instruction: prev.instruction,
			marks: prev.marks,
		}));
		setTypeDropOpen(false);
	};

	const validate = (): boolean => {
		const errs: Partial<Record<keyof SingleQuestionFormState, string>> = {};
		if (!form.questionText.trim())
			errs.questionText = "Question text is required";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		setSaving(true);

		try {
			const payload = singleQuestionToPayload(
				form,
				classId,
				subjectId,
				topicId,
			);

			if (editQuestion?.id) {
				await updateQuestion({ id: editQuestion.id, payload });
			} else {
				await createQuestion(payload);
			}

			toast({ title: "Question saved successfully!", type: "success" });
			onSaved();
		} catch (err: unknown) {
			const message =
				err && typeof err === "object" && "message" in err
					? String((err as { message: string }).message)
					: "Could not save question";
			toast({ title: message, type: "error" });
		} finally {
			setSaving(false);
		}
	};

	const isChoiceType =
		form.questionType === "multiple-choice" ||
		form.questionType === "multiple-answers";
	const isTextAnswerType = [
		"short-answer",
		"fill-in-blank",
		"numerical",
	].includes(form.questionType);

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			{/* Top bar */}
			<div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
				<button
					onClick={onClose}
					className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					onClick={handleSave}
					disabled={saving}
					className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
				>
					{saving && (
						<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
					)}
					{editQuestion ? "Update Question" : "Save Question"}
				</button>
			</div>

			{/* Form body */}
			<div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
				{/* Instruction */}
				<FormSection title="Instruction" optional>
					<p className="mb-2 text-xs text-gray-400">
						Add a brief instruction if needed. Example: &quot;Fill in the
						gaps&quot; or &quot;Complete the sentence&quot;
					</p>
					<input
						type="text"
						value={form.instruction}
						onChange={(e) => updateField("instruction", e.target.value)}
						placeholder="Example: fill in the gaps with the correct words"
						className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</FormSection>

				{/* Question text + type selector */}
				<FormSection title="">
					{/* Type selector row */}
					<div className="mb-3 flex items-center gap-3">
						<div className="relative">
							<button
								onClick={() => setTypeDropOpen((v) => !v)}
								className="flex h-8 items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
							>
								{QUESTION_TYPES.find(
									(t) => t.type === form.questionType,
								)?.label ?? form.questionType}
								<svg
									className="h-3.5 w-3.5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							{typeDropOpen && (
								<div className="absolute top-full left-0 z-30 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
									{QUESTION_TYPES.map(({ type, label }) => (
										<button
											key={type}
											onClick={() => changeType(type)}
											className={cn(
												"w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50",
												form.questionType === type
													? "font-semibold text-blue-700"
													: "text-gray-700",
											)}
										>
											{label}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Image upload stub */}
						<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
							<ImageIcon className="h-4 w-4" />
						</button>
					</div>

					{/* Question text input */}
					<div className="relative">
						<input
							type="text"
							value={form.questionText}
							onChange={(e) =>
								updateField("questionText", e.target.value)
							}
							placeholder="Type your question"
							className={cn(
								"h-11 w-full rounded-xl border px-4 py-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
								errors.questionType
									? "border-red-400"
									: "border-gray-200",
							)}
						/>
						{errors.questionType && (
							<p className="mt-1 text-xs text-red-500">
								{errors.questionType}
							</p>
						)}
					</div>

					{/* Image preview area */}
					{form.imageUrl === "placeholder" && (
						<div className="relative mt-3 h-40 w-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
							<div
								className="absolute inset-0"
								style={{
									backgroundImage:
										"repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%)",
									backgroundSize: "20px 20px",
								}}
							/>
							<div className="absolute bottom-2 left-2 flex gap-2">
								<button
									onClick={() => updateField("imageUrl", null)}
									className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/90 px-3 py-1.5 text-xs text-gray-700 shadow-sm transition-colors hover:bg-white"
								>
									<Trash2 className="h-3 w-3" />
								</button>
								<button className="rounded-lg border border-gray-200 bg-white/90 px-3 py-1.5 text-xs text-gray-700 shadow-sm transition-colors hover:bg-white">
									Replace
								</button>
							</div>
						</div>
					)}
					{!form.imageUrl && (
						<button
							onClick={() => updateField("imageUrl", "placeholder")}
							className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-all hover:border-blue-300 hover:text-blue-500"
						>
							<ImageIcon className="h-3.5 w-3.5" />
							Add image
						</button>
					)}
				</FormSection>

				{/* Type-specific answer fields */}
				{isChoiceType && (
					<OptionsEditor
						options={form.options}
						onChange={(options) => updateField("options", options)}
						multiSelect={form.questionType === "multiple-answers"}
					/>
				)}

				{form.questionType === "true-false" && (
					<TrueFalseEditor
						options={form.options}
						onChange={(options) => updateField("options", options)}
					/>
				)}

				{isTextAnswerType && (
					<FormSection title="Expected Answer" optional>
						<input
							type="text"
							value={form.correctAnswer}
							onChange={(e) =>
								updateField("correctAnswer", e.target.value)
							}
							placeholder="Add multiple by separating with a comma"
							className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</FormSection>
				)}

				{form.questionType === "essay" && (
					<FormSection title="">
						<p className="py-2 text-sm text-gray-400 italic">
							Students will provide a long-form written response. No
							expected answer needed.
						</p>
					</FormSection>
				)}

				{/* Marks */}
				<div className="flex items-center gap-3 pb-2">
					<span className="text-sm font-medium text-gray-700">Marks:</span>
					<input
						type="number"
						min={1}
						value={form.marks}
						onChange={(e) =>
							updateField("marks", Math.max(1, Number(e.target.value)))
						}
						className="h-8 w-16 rounded-lg border border-gray-200 text-center text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	);
};

// ─── Form section wrapper ─────────────────────────────────────────────────────

export const FormSection = ({
	title,
	optional,
	children,
}: {
	title: string;
	optional?: boolean;
	children: React.ReactNode;
}) => (
	<div className="rounded-xl border border-gray-200 bg-white p-4">
		{title && (
			<h3 className="mb-2 text-sm font-semibold text-gray-900">
				{title}{" "}
				{optional && (
					<span className="text-xs font-normal text-gray-400">
						(optional)
					</span>
				)}
			</h3>
		)}
		{children}
	</div>
);

// ─── Options editor ───────────────────────────────────────────────────────────

const OptionsEditor = ({
	options,
	onChange,
	multiSelect,
}: {
	options: Option[];
	onChange: (opts: Option[]) => void;
	multiSelect: boolean;
}) => {
	const toggleCorrect = (id: string) => {
		const next = multiSelect
			? options.map((o) =>
					o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
				)
			: options.map((o) => ({ ...o, isCorrect: o.id === id }));
		onChange(next);
	};

	const updateText = (id: string, text: string) =>
		onChange(options.map((o) => (o.id === id ? { ...o, text } : o)));

	const removeOption = (id: string) => {
		if (options.length <= 2) return;
		onChange(options.filter((o) => o.id !== id));
	};

	const addOption = () => {
		const next = String.fromCharCode(97 + options.length);
		onChange([...options, { id: next, text: "", isCorrect: false }]);
	};

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-4">
			<div className="space-y-2">
				{options.map((opt) => (
					<div key={opt.id} className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => toggleCorrect(opt.id)}
							className={cn(
								"flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-all",
								multiSelect ? "rounded" : "rounded-full",
								opt.isCorrect
									? "border-blue-500 bg-blue-500 text-white"
									: "border-gray-300 hover:border-blue-400",
							)}
						>
							{opt.isCorrect && <Check className="h-3 w-3" />}
						</button>
						<span className="w-5 text-sm font-medium text-gray-500 uppercase">
							{opt.id}.
						</span>
						<input
							type="text"
							value={opt.text}
							onChange={(e) => updateText(opt.id, e.target.value)}
							placeholder={`Option ${opt.id.toUpperCase()}`}
							className="h-9 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						{options.length > 2 && (
							<button
								onClick={() => removeOption(opt.id)}
								className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-300 transition-colors hover:text-red-500"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						)}
					</div>
				))}

				{options.length < 8 && (
					<button
						type="button"
						onClick={addOption}
						className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600"
					>
						<Plus className="h-3.5 w-3.5" />
						Add Option
					</button>
				)}
			</div>
		</div>
	);
};

// ─── True/False editor ────────────────────────────────────────────────────────

const TrueFalseEditor = ({
	options,
	onChange,
}: {
	options: Option[];
	onChange: (opts: Option[]) => void;
}) => {
	const setCorrect = (id: "true" | "false") =>
		onChange(options.map((o) => ({ ...o, isCorrect: o.id === id })));
	const current = options.find((o) => o.isCorrect)?.id;

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-4">
			<div className="flex gap-3">
				{(["true", "false"] as const).map((val) => (
					<button
						key={val}
						type="button"
						onClick={() => setCorrect(val)}
						className={cn(
							"flex-1 rounded-xl border py-2.5 text-sm font-medium capitalize transition-all",
							current === val
								? "border-blue-500 bg-blue-50 text-blue-700"
								: "border-gray-200 text-gray-600 hover:border-gray-300",
						)}
					>
						{val.charAt(0).toUpperCase() + val.slice(1)}
					</button>
				))}
			</div>
		</div>
	);
};

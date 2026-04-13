"use client";

import React, { useCallback, useState } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	buildDefaultOptions,
	buildSingleQuestionPayload,
	fromApiOptions,
} from "@/utils/question";
import {
	DifficultySelector,
	FormTopBar,
	InstructionInput,
	MarksInput,
	Section,
} from "@/utils/formPrimitives";
import {
	CorrectAnswersInput,
	NumericAnswerInput,
	OptionsEditor,
	TrueFalseEditor,
} from "@/utils/answerEditors";
import {
	QuestionTypeDropdown,
	SINGLE_QUESTION_TYPES,
} from "@/utils/questionTypeSelector";
import {
	useCreateCbtQuestion,
	useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import { toast } from "@/components/Toast";
import type {
	ApiQuestion,
	DifficultyLevel,
	OptionFormItem,
	QuestionType,
} from "@/types/question";

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
	questionType: QuestionType;
	questionText: string;
	instruction: string;
	explanation: string;
	marks: number;
	difficultyLevel: DifficultyLevel;
	imageUrl: string;
	// type-specific
	options: OptionFormItem[];
	trueFalseAnswer: boolean;
	correctAnswerText: string;
	numericAnswer: number;
	numericTolerance: number;
	numericUnit: string;
}

const INITIAL: FormState = {
	questionType: "MULTIPLE_CHOICE",
	questionText: "",
	instruction: "",
	explanation: "",
	marks: 1,
	difficultyLevel: "",
	imageUrl: "",
	options: buildDefaultOptions(),
	trueFalseAnswer: true,
	correctAnswerText: "",
	numericAnswer: 0,
	numericTolerance: 0,
	numericUnit: "",
};

// ─── Hydrate from existing question ──────────────────────────────────────────

function hydrateForm(q: ApiQuestion): FormState {
	const tsd = q?.typeSpecificData;
	const state: FormState = {
		...INITIAL,
		questionType: q?.questionType,
		questionText: q?.questionText,
		explanation: q?.explanation ?? "",
		marks: q?.marks,
		difficultyLevel: (q?.difficultyLevel as DifficultyLevel) ?? "",
		imageUrl: q?.imageUrl ?? "",
	};

	if (tsd?.questionType === "MULTIPLE_CHOICE")
		state.options = fromApiOptions(tsd?.options);
	if (tsd?.questionType === "MULTIPLE_ANSWERS")
		state.options = fromApiOptions(tsd?.options);
	if (tsd?.questionType === "TRUE_FALSE")
		state.trueFalseAnswer = tsd?.correctAnswer;
	if (tsd?.questionType === "SHORT_ANSWER")
		state.correctAnswerText = (tsd?.correctAnswers ?? []).join(", ");
	if (tsd?.questionType === "NUMERIC_ANSWER") {
		state.numericAnswer = tsd?.correctAnswer ?? 0;
		state.numericTolerance = tsd?.tolerance ?? 0;
		state.numericUnit = tsd?.unit ?? "";
	}

	return state;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddQuestionFormProps {
	classId: number;
	subjectId: number;
	topicId: number;
	editQuestion?: ApiQuestion | null;
	onClose: () => void;
	onSaved: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddQuestionForm = ({
	classId,
	subjectId,
	topicId,
	editQuestion,
	onClose,
	onSaved,
}: AddQuestionFormProps) => {
	const [form, setForm] = useState<FormState>(() =>
		editQuestion ? hydrateForm(editQuestion) : INITIAL,
	);
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormState, string>>
	>({});

	const { mutateAsync: createQuestion, isPending: isCreating } =
		useCreateCbtQuestion();
	const { mutateAsync: updateQuestion, isPending: isUpdating } =
		useUpdateCbtQuestion();
	const saving = isCreating || isUpdating;

	const update = useCallback(
		<K extends keyof FormState>(key: K, val: FormState[K]) => {
			setForm((prev) => ({ ...prev, [key]: val }));
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		},
		[],
	);

	const changeType = (questionType: QuestionType) => {
		setForm((prev) => ({
			...INITIAL,
			questionType,
			questionText: prev?.questionText,
			instruction: prev?.instruction,
			explanation: prev?.explanation,
			marks: prev?.marks,
			difficultyLevel: prev?.difficultyLevel,
			imageUrl: prev?.imageUrl,
		}));
	};

	const validate = (): boolean => {
		const errs: Partial<Record<keyof FormState, string>> = {};
		if (!form?.questionText.trim())
			errs.questionText = "Question text is required";
		if (
			(form?.questionType === "MULTIPLE_CHOICE" ||
				form?.questionType === "MULTIPLE_ANSWERS") &&
			!form?.options.some((o) => o.isCorrect)
		)
			errs.options = "Mark at least one option as correct";
		setErrors(errs);
		return Object.keys(errs)?.length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;

		const payload = buildSingleQuestionPayload({
			classId,
			subjectId,
			topicId,
			...form,
		});

		try {
			if (editQuestion) {
				await updateQuestion({ id: editQuestion.id, payload });
				toast({ title: "Question updated", type: "success" });
			} else {
				await createQuestion(payload);
				toast({ title: "Question saved", type: "success" });
			}
			onSaved();
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "message" in err
					? String((err as { message: string }).message)
					: "Could not save question";
			toast({ title: msg, type: "error" });
		}
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<FormTopBar
				onCancel={onClose}
				onSave={handleSave}
				saving={saving}
				isEdit={!!editQuestion}
			/>

			<div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
				<InstructionInput
					value={form?.instruction}
					onChange={(v) => update("instruction", v)}
				/>

				{/* Question text + type picker */}
				<Section title="">
					<div className="mb-3 flex items-center gap-3">
						<QuestionTypeDropdown
							value={form?.questionType}
							onChange={changeType}
							types={SINGLE_QUESTION_TYPES}
						/>
						<button
							type="button"
							title="Add image"
							className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
						>
							<ImageIcon className="h-4 w-4" />
						</button>
					</div>

					<div className="relative">
						<textarea
							rows={2}
							value={form?.questionText}
							onChange={(e) => update("questionText", e.target.value)}
							placeholder="Type your question"
							className={cn(
								"w-full resize-none rounded-xl border px-4 py-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
								errors.questionText
									? "border-red-400"
									: "border-gray-200",
							)}
						/>
						{errors?.questionText && (
							<p className="mt-1 text-xs text-red-500">
								{errors?.questionText}
							</p>
						)}
					</div>

					{form?.imageUrl && (
						<div className="relative mt-3 h-40 w-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
							<img
								src={form?.imageUrl}
								alt=""
								className="h-full w-full object-cover"
							/>
							<button
								type="button"
								onClick={() => update("imageUrl", "")}
								className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/90 px-3 py-1.5 text-xs text-gray-700 shadow-sm hover:bg-white"
							>
								<Trash2 className="h-3 w-3" />
								Remove
							</button>
						</div>
					)}
				</Section>

				{/* Type-specific answer fields */}
				{(form?.questionType === "MULTIPLE_CHOICE" ||
					form?.questionType === "MULTIPLE_ANSWERS") && (
					<Section
						title="Answer Options"
						hint="Click the circle/checkbox to mark the correct answer(s)"
					>
						{errors?.options && (
							<p className="mb-2 text-xs text-red-500">
								{errors?.options}
							</p>
						)}
						<OptionsEditor
							options={form?.options}
							onChange={(opts) => update("options", opts)}
							multiSelect={form?.questionType === "MULTIPLE_ANSWERS"}
						/>
					</Section>
				)}

				{form?.questionType === "TRUE_FALSE" && (
					<Section title="Correct Answer">
						<TrueFalseEditor
							correctAnswer={form?.trueFalseAnswer}
							onChange={(v) => update("trueFalseAnswer", v)}
						/>
					</Section>
				)}

				{form?.questionType === "SHORT_ANSWER" && (
					<Section title="Expected Answer" optional>
						<CorrectAnswersInput
							value={form?.correctAnswerText}
							onChange={(v) => update("correctAnswerText", v)}
						/>
					</Section>
				)}

				{form?.questionType === "NUMERIC_ANSWER" && (
					<Section title="Numeric Answer">
						<NumericAnswerInput
							correctAnswer={form?.numericAnswer}
							tolerance={form?.numericTolerance}
							unit={form?.numericUnit}
							onChangeAnswer={(v) => update("numericAnswer", v)}
							onChangeTolerance={(v) => update("numericTolerance", v)}
							onChangeUnit={(v) => update("numericUnit", v)}
						/>
					</Section>
				)}

				{form?.questionType === "ESSAY" && (
					<Section title="">
						<p className="py-2 text-sm italic text-gray-400">
							Students will provide a long-form written response. No
							expected answer is needed here.
						</p>
					</Section>
				)}

				<Section
					title="Explanation"
					optional
					hint="Shown to students after they answer"
				>
					<textarea
						rows={2}
						value={form?.explanation}
						onChange={(e) => update("explanation", e.target.value)}
						placeholder="Explain why the correct answer is correct…"
						className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</Section>

				<div className="flex flex-wrap items-center gap-5 pb-2">
					<MarksInput
						value={form?.marks}
						onChange={(v) => update("marks", v)}
					/>
					<DifficultySelector
						value={form?.difficultyLevel}
						onChange={(v) => update("difficultyLevel", v)}
					/>
				</div>
			</div>
		</div>
	);
};

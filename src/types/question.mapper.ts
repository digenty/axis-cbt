import {
	ApiQuestion,
	ApiQuestionType,
	CreateQuestionPayload,
	TypeSpecificData,
} from "./question";
import {
	Blank,
	NormalizedQuestion,
	Option,
	QuestionType,
	SingleQuestionFormState,
	SubQuestion,
} from "./question.types";

// ─── Internal type → API enum ─────────────────────────────────────────────────

const TYPE_MAP: Record<QuestionType, ApiQuestionType> = {
	"multiple-choice": "MULTIPLE_CHOICE",
	"multiple-answers": "MULTIPLE_ANSWERS",
	"true-false": "TRUE_FALSE",
	essay: "ESSAY",
	"fill-in-blank": "FILL_IN_THE_BLANK",
	"short-answer": "SHORT_ANSWER",
	numerical: "NUMERIC_ANSWER",
	matching: "MATCH",
	"question-group": "QUESTION_GROUP",
	"multiple-blanks": "FILL_IN_THE_BLANK",
	"comprehension-passage": "QUESTION_GROUP",
};

const API_TYPE_REVERSE_MAP: Partial<Record<ApiQuestionType, QuestionType>> = {
	MULTIPLE_CHOICE: "multiple-choice",
	MULTIPLE_ANSWERS: "multiple-answers",
	TRUE_FALSE: "true-false",
	ESSAY: "essay",
	FILL_IN_THE_BLANK: "fill-in-blank",
	SHORT_ANSWER: "short-answer",
	NUMERIC_ANSWER: "numerical",
	MATCH: "matching",
	QUESTION_GROUP: "question-group",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildOptionsPayload(
	options: Option[],
): { optionText: string; optionLabel: string; isCorrect: boolean }[] {
	return options.map((o) => ({
		optionText: o.text,
		optionLabel: o.id.toUpperCase(),
		isCorrect: o.isCorrect,
	}));
}

function buildTypeSpecificData(
	form: SingleQuestionFormState,
): TypeSpecificData {
	switch (form.questionType) {
		case "multiple-choice":
			return {
				questionType: "MULTIPLE_CHOICE",
				options: buildOptionsPayload(form.options),
			};

		case "multiple-answers":
			return {
				questionType: "MULTIPLE_ANSWERS",
				options: buildOptionsPayload(form.options),
				partialCredit: false,
			};

		case "true-false": {
			const correctOpt = form.options.find((o) => o.isCorrect);
			return {
				questionType: "TRUE_FALSE",
				correctAnswer: correctOpt?.id === "true",
			};
		}

		case "essay":
			return {
				questionType: "ESSAY",
				modelAnswer: form.correctAnswer || undefined,
			};

		case "short-answer":
			return {
				questionType: "SHORT_ANSWER",
				correctAnswers: form.correctAnswer
					? form.correctAnswer
							.split(",")
							.map((s) => s.trim())
							.filter(Boolean)
					: [],
				caseSensitive: false,
				exactMatch: false,
			};

		case "numerical":
			return {
				questionType: "NUMERIC_ANSWER",
				correctAnswer: form.correctAnswer
					? Number(form.correctAnswer)
					: undefined,
			};

		case "fill-in-blank":
			return {
				questionType: "FILL_IN_THE_BLANK",
				instruction: form.instruction || undefined,
				correctAnswers: form.correctAnswer
					? form.correctAnswer
							.split(",")
							.map((s) => s.trim())
							.filter(Boolean)
					: [],
			} as TypeSpecificData;

		// multiple-blanks and matching are handled in their own dedicated forms/mappers
		default:
			return { questionType: "ESSAY" };
	}
}

/** Build a CreateQuestionPayload from the single-question form state */
export function singleQuestionToPayload(
	form: SingleQuestionFormState,
	classId: number,
	subjectId: number,
	topicId: number,
): CreateQuestionPayload {
	return {
		classId,
		subjectId,
		topicId,
		questionText: form.questionText,
		imageUrl: form.imageUrl ?? undefined,
		marks: form.marks,
		explanation: form.instruction || undefined,
		questionType: TYPE_MAP[form.questionType],
		typeSpecificData: buildTypeSpecificData(form),
	};
}

// ─── Question Group mapper ────────────────────────────────────────────────────

export function questionGroupToPayload(
	groupName: string,
	passage: string,
	instruction: string,
	materialType: string,
	subQuestions: SubQuestion[],
	classId: number,
	subjectId: number,
	topicId: number,
): CreateQuestionPayload {
	return {
		classId,
		subjectId,
		topicId,
		questionText: groupName,
		marks: subQuestions.reduce((s, q) => s + q.marks, 0) || 1,
		explanation: instruction || undefined,
		questionType: "QUESTION_GROUP",
		typeSpecificData: {
			questionType: "QUESTION_GROUP",
			stimulusType: materialType.toUpperCase().replace(/\s+/g, "_"),
			stimulusContent: passage,
			stimulusHtml: passage,
			subQuestions: subQuestions.map((sq) => ({
				questionText: sq.questionText,
				marks: sq.marks,
				explanation: sq.instruction || undefined,
				questionType: "MULTIPLE_CHOICE" as ApiQuestionType,
				typeSpecificData: {
					questionType: "MULTIPLE_CHOICE" as const,
					options: buildOptionsPayload(sq.options),
				},
			})),
		},
	};
}

// ─── Multiple Blanks mapper ───────────────────────────────────────────────────

export function multipleBlanksToPayload(
	questionText: string,
	instruction: string,
	blanks: Blank[],
	classId: number,
	subjectId: number,
	topicId: number,
): CreateQuestionPayload {
	return {
		classId,
		subjectId,
		topicId,
		questionText,
		marks: blanks.reduce((s, b) => s + b.mark, 0) || 1,
		explanation: instruction || undefined,
		questionType: "FILL_IN_THE_BLANK",
		typeSpecificData: {
			questionType: "FILL_IN_THE_BLANK",
			instruction,
			blanks: blanks.map((b) => ({
				blankLabel: b.label,
				marks: b.mark,
				answerType:
					b.answerType === "multiple-choice"
						? "MULTIPLE_CHOICE"
						: "SHORT_ANSWER",
				correctAnswers: b.answers,
			})),
		},
	};
}

// ─── API response → NormalizedQuestion ───────────────────────────────────────

export function normalizeApiQuestion(q: ApiQuestion): NormalizedQuestion {
	const questionType: QuestionType =
		API_TYPE_REVERSE_MAP[q.questionType] ?? "essay";

	const base: NormalizedQuestion = {
		id: q.id,
		topicId: q.topicId,
		questionType,
		questionText: q.questionText,
		marks: q.marks,
		instruction: q.explanation,
		imageUrl: q.imageUrl,
		createdAt: q.createdAt,
		updatedAt: q.updatedAt,
	};

	const tsd = q.typeSpecificData;

	if (
		tsd?.questionType === "MULTIPLE_CHOICE" ||
		tsd?.questionType === "MULTIPLE_ANSWERS"
	) {
		base.options = tsd.options.map((o, idx) => ({
			id: o.optionLabel?.toLowerCase() ?? String.fromCharCode(97 + idx),
			text: o.optionText,
			isCorrect: o.isCorrect,
		}));
	}

	if (tsd?.questionType === "TRUE_FALSE") {
		base.options = [
			{ id: "true", text: "True", isCorrect: tsd?.correctAnswer === true },
			{
				id: "false",
				text: "False",
				isCorrect: tsd?.correctAnswer === false,
			},
		];
	}

	if (tsd?.questionType === "ESSAY") {
		base.correctAnswer = tsd?.modelAnswer;
	}

	if (tsd?.questionType === "SHORT_ANSWER") {
		base.correctAnswer = tsd?.correctAnswers?.join(", ");
	}

	if (tsd?.questionType === "NUMERIC_ANSWER") {
		base.correctAnswer =
			tsd?.correctAnswer !== undefined
				? String(tsd?.correctAnswer)
				: undefined;
	}

	if (tsd?.questionType === "FILL_IN_THE_BLANK") {
		base.blanks = (tsd?.blanks ?? []).map((b, idx) => ({
			id: String(idx),
			label: b.blankLabel ?? `Blank ${idx + 1}`,
			answerType:
				b.answerType === "MULTIPLE_CHOICE"
					? "multiple-choice"
					: "short-answer",
			answers: b.correctAnswers ?? [],
			mark: b.marks ?? 1,
		}));
	}

	if (tsd?.questionType === "MATCH") {
		base.matchItems = tsd?.pairs.map((p, idx) => ({
			id: String(idx),
			text: p.itemText ?? "",
		}));
		base.matchOptions = tsd?.pairs.map((p, idx) => ({
			id: String(idx),
			text: p.matchText ?? "",
		}));
	}

	if (tsd?.questionType === "QUESTION_GROUP") {
		base.passage = tsd?.stimulusContent;
		base.subQuestions = (tsd?.subQuestions ?? []).map((sq) =>
			normalizeApiQuestion({
				...q,
				id: 0,
				questionText: sq.questionText,
				marks: sq.marks,
				explanation: sq.explanation,
				questionType: sq.questionType,
				typeSpecificData: sq.typeSpecificData,
			}),
		);
	}

	return base;
}

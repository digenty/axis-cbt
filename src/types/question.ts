// ─── Question type enum ───────────────────────────────────────────────────────

export type QuestionType =
	| "MULTIPLE_CHOICE"
	| "MULTIPLE_ANSWERS"
	| "TRUE_FALSE"
	| "ESSAY"
	| "SHORT_ANSWER"
	| "NUMERIC_ANSWER"
	| "FILL_IN_THE_BLANK"
	| "MATCH"
	| "QUESTION_GROUP"
	| "COMPREHENSION";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "";

// ─── Shared sub-shapes ────────────────────────────────────────────────────────

export interface OptionData {
	optionText: string;
	optionHtml?: string;
	optionLabel: string;
	imageUrl?: string;
	isCorrect: boolean;
}

export interface BlankData {
	blankLabel?: string;
	marks?: number;
	answerType?: "SHORT_ANSWER" | "MULTIPLE_CHOICE";
	correctAnswers?: string[];
}

export interface MatchPairData {
	itemText?: string;
	itemHtml?: string;
	matchText?: string;
	matchHtml?: string;
	itemImageUrl?: string;
	matchImageUrl?: string;
}

// ─── ResponseTypeSpecificData ─────────────────────────────────────────────────
// Discriminated on `questionType` — this is what the GET API returns.

export type ResponseTypeSpecificData =
	| { questionType: "MULTIPLE_CHOICE"; options: OptionData[] }
	| {
			questionType: "MULTIPLE_ANSWERS";
			options: OptionData[];
			minSelections?: number;
			maxSelections?: number;
			partialCredit?: boolean;
	  }
	| { questionType: "TRUE_FALSE"; correctAnswer: boolean }
	| {
			questionType: "ESSAY";
			minWords?: number;
			maxWords?: number;
			modelAnswer?: string;
			rubric?: string;
	  }
	| {
			questionType: "SHORT_ANSWER";
			correctAnswers?: string[];
			caseSensitive?: boolean;
			exactMatch?: boolean;
			maxLength?: number;
	  }
	| {
			questionType: "NUMERIC_ANSWER";
			correctAnswer?: number;
			tolerance?: number;
			minValue?: number;
			maxValue?: number;
			unit?: string;
			decimalPlaces?: number;
	  }
	| {
			questionType: "FILL_IN_THE_BLANK";
			blanks?: BlankData[];
			caseSensitive?: boolean;
			instruction?: string;
	  }
	| {
			questionType: "MATCH";
			pairs: MatchPairData[];
			marksForEach?: number;
			shuffleItems?: boolean;
			partialCredit?: boolean;
	  }
	| {
			questionType: "QUESTION_GROUP";
			stimulusType?: string;
			stimulusContent?: string;
			stimulusHtml?: string;
			stimulusImageUrl?: string;
			chartData?: string;
			tableData?: string;
			subQuestions?: ResponseSubQuestion[];
	  }
	| {
			questionType: "COMPREHENSION";
			stimulusType?: string;
			stimulusContent?: string;
			stimulusHtml?: string;
			stimulusImageUrl?: string;
			subQuestions?: ResponseSubQuestion[];
	  };

export interface ResponseSubQuestion {
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	questionType: Exclude<QuestionType, "QUESTION_GROUP" | "COMPREHENSION">;
	typeSpecificData: Exclude<
		ResponseTypeSpecificData,
		{ questionType: "QUESTION_GROUP" } | { questionType: "COMPREHENSION" }
	>;
}

// ─── PayloadTypeSpecificData ──────────────────────────────────────────────────
// Discriminated on `type` — this is what POST/PUT bodies must send.
// The Java backend's @JsonTypeInfo uses `type` as the property name.

export type PayloadTypeSpecificData =
	| { type: "MULTIPLE_CHOICE"; options: OptionData[] }
	| {
			type: "MULTIPLE_ANSWERS";
			options: OptionData[];
			minSelections?: number;
			maxSelections?: number;
			partialCredit?: boolean;
	  }
	| { type: "TRUE_FALSE"; correctAnswer: boolean }
	| {
			type: "ESSAY";
			minWords?: number;
			maxWords?: number;
			modelAnswer?: string;
			rubric?: string;
	  }
	| {
			type: "SHORT_ANSWER";
			correctAnswers?: string[];
			caseSensitive?: boolean;
			exactMatch?: boolean;
			maxLength?: number;
	  }
	| {
			type: "NUMERIC_ANSWER";
			correctAnswer?: number;
			tolerance?: number;
			minValue?: number;
			maxValue?: number;
			unit?: string;
			decimalPlaces?: number;
	  }
	| {
			type: "FILL_IN_THE_BLANK";
			blanks?: BlankData[];
			caseSensitive?: boolean;
			instruction?: string;
	  }
	| {
			type: "MATCH";
			pairs: MatchPairData[];
			marksForEach?: number;
			shuffleItems?: boolean;
			partialCredit?: boolean;
	  }
	| {
			type: "QUESTION_GROUP";
			stimulusType?: string;
			stimulusContent?: string;
			stimulusHtml?: string;
			stimulusImageUrl?: string;
			chartData?: string;
			tableData?: string;
			subQuestions?: PayloadSubQuestion[];
	  }
	| {
			type: "COMPREHENSION";
			stimulusType?: string;
			stimulusContent?: string;
			stimulusHtml?: string;
			stimulusImageUrl?: string;
			subQuestions?: PayloadSubQuestion[];
	  };

export type PayloadSubQuestionTypeSpecificData = Exclude<
	PayloadTypeSpecificData,
	{ type: "QUESTION_GROUP" } | { type: "COMPREHENSION" }
>;

export type SubQuestionType = Exclude<
	QuestionType,
	"QUESTION_GROUP" | "COMPREHENSION"
>;

export interface PayloadSubQuestion {
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	questionType: SubQuestionType;
	typeSpecificData: PayloadSubQuestionTypeSpecificData;
}

// ─── API Request payload (POST / PUT body) ────────────────────────────────────

export interface CreateQuestionPayload {
	classId: number;
	subjectId: number;
	topicId: number;
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	difficultyLevel?: string;
	questionType: QuestionType;
	typeSpecificData: PayloadTypeSpecificData;
}

// ─── API Response shapes ──────────────────────────────────────────────────────

// export interface ApiOptions {
// 	id: number;
// 	optionText: string;
// 	optionHtml: string;
// 	optionLabel: string;
// 	optionOrder: number;
// 	imageUrl: string;
// 	isCorrect: boolean;
// }
export interface ApiQuestion {
	id: number;
	classId: number;
	subjectId: number;
	topicId: number;
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	difficultyLevel?: string;
	questionType: QuestionType;
	typeSpecificData: ResponseTypeSpecificData;
	options?: OptionData[];
	blanks?: BlankData[];
	pairs?: MatchPairData[];
	createdAt?: string;
	updatedAt?: string;
}

export interface ApiTopic {
	id: number;
	name: string;
	description?: string;
	classId: number;
	subjectId: number;
	branchId?: number;
	displayOrder?: number;
}

export interface CbtQueBankTopicPayload {
	name: string;
	classId: number;
	subjectId: number;
	branchId: number;
	description: string;
	displayOrder: number;
	id?: number;
}

export interface TopicsResponse {
	data: ApiTopic[];
	message: string;
	status: string;
}

export interface TopicResponse {
	data: ApiTopic;
	message: string;
	status: string;
}

export interface QuestionsListResponse {
	data: ApiQuestion[];
	message: string;
	status: string;
}

export interface QuestionResponse {
	data: ApiQuestion;
	message: string;
	status: string;
}

export interface ImportQuestionsResult {
	imported: number;
	failed: number;
	errors: string[];
}

// ─── UI-only form state types ─────────────────────────────────────────────────

export interface OptionFormItem {
	id: string; // "a", "b", "c", "d"
	text: string;
	isCorrect: boolean;
}

export interface BlankFormItem {
	id: string;
	label: string;
	answerType: "short-answer" | "multiple-choice";
	answers: string[];
	mark: number;
	options?: OptionFormItem[];
}

export interface SubQuestionFormItem {
	id: string;
	type: SubQuestionType;
	text: string;
	marks: number;
	options: OptionFormItem[];
}

export type StimulusType =
	| "Comprehension Passage"
	| "Diagram"
	| "Table"
	| "Chart"
	| "Multiple Blanks";

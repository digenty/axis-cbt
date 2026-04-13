// ─── API question type enum ───────────────────────────────────────────────────
// One type used everywhere — UI, API payloads, and API responses.
// COMPREHENSION is an alias for QUESTION_GROUP with stimulusType = "COMPREHENSION".

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

// ─── Shared data shapes ───────────────────────────────────────────────────────

export interface OptionData {
	optionText: string;
	optionHtml?: string;
	optionLabel: string; // "A", "B", "C" …
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

// ─── TypeSpecificData — discriminated on `questionType` ───────────────────────

export type TypeSpecificData =
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
			// QUESTION_GROUP covers all grouped-stimulus types (Passage, Diagram, Table, Chart)
			questionType: "QUESTION_GROUP";
			stimulusType?: string;
			stimulusContent?: string;
			stimulusHtml?: string;
			stimulusImageUrl?: string;
			chartData?: string;
			tableData?: string;
			subQuestions?: SubQuestionRequest[];
	  }
	| {
			// COMPREHENSION is a named alias — sent as QUESTION_GROUP with stimulusType="COMPREHENSION"
			questionType: "COMPREHENSION";
			stimulusType?: string;
			stimulusContent?: string;
			stimulusHtml?: string;
			stimulusImageUrl?: string;
			subQuestions?: SubQuestionRequest[];
	  };

// Sub-questions cannot nest QUESTION_GROUP / COMPREHENSION
export type SubQuestionTypeSpecificData = Exclude<
	TypeSpecificData,
	{ questionType: "QUESTION_GROUP" } | { questionType: "COMPREHENSION" }
>;

export type SubQuestionType = Exclude<
	QuestionType,
	"QUESTION_GROUP" | "COMPREHENSION"
>;

export interface SubQuestionRequest {
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	questionType: SubQuestionType;
	typeSpecificData: SubQuestionTypeSpecificData;
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
	typeSpecificData: TypeSpecificData;
}

export interface UpdateQuestionPayload extends Partial<CreateQuestionPayload> {
	id: number;
}

// ─── API Response shapes ──────────────────────────────────────────────────────

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
	typeSpecificData: TypeSpecificData;
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

// ─── UI-only form state types (never sent to API directly) ────────────────────

export interface OptionFormItem {
	id: string; // "a", "b", "c", "d"
	text: string;
	isCorrect: boolean;
}

export interface BlankFormItem {
	id: string; // local only
	label: string;
	answerType: "short-answer" | "multiple-choice";
	answers: string[];
	mark: number;
	options?: OptionFormItem[];
}

export interface SubQuestionFormItem {
	id: string; // local only
	type: SubQuestionType;
	text: string;
	marks: number;
	options: OptionFormItem[];
	correctAnswerText: string; // comma-sep for SHORT_ANSWER
	trueFalseAnswer: boolean;
}

export type StimulusType =
	| "Comprehension Passage"
	| "Diagram"
	| "Table"
	| "Chart"
	| "Multiple Blanks";

// ─── Status ───────────────────────────────────────────────────────────────────

export type StudentAssessmentStatus =
	| "in-progress"
	| "not-started"
	| "scheduled"
	| "graded"
	| "submitted"
	| "missed";

// ─── Dashboard card ───────────────────────────────────────────────────────────

export interface StudentAssessmentCard {
	id: string;
	subject: string;
	subjectColor: "blue" | "green" | "purple" | "amber" | "indigo";
	title: string;
	status: StudentAssessmentStatus;
	durationMinutes: number;
	questionsCount: number;
	scheduledAt: string;
	score?: number;
	totalMarks?: number;
}

export interface StudentProfile {
	name: string;
	admissionNumber: string;
	className: string;
	academicYear: string;
	currentTerm: string;
}

// ─── Assessment detail (pre-test / result) ────────────────────────────────────

export interface AssessmentDetail {
	id: string;
	title: string;
	subject: string;
	totalMarks: number;
	className: string;
	durationMinutes: number;
	questionsCount: number;
	instructions: string;
	rules: string[];
	importantNotes: string[];
	status: StudentAssessmentStatus;
	score?: number;
	scoreDenominator?: number;
	teacherFeedback?: string;
	scheduledAt: string;
}

// ─── Test-taking ──────────────────────────────────────────────────────────────

export type TakerQuestionType =
	| "multiple-choice"
	| "multiple-answers"
	| "true-false"
	| "fill-in-blank"
	| "match"
	| "essay"
	| "short-answer";

export interface QuestionOption {
	label: string;
	text: string;
}

export interface MatchPair {
	id: string;
	left: string;
	choices: string[];
}

export type BlankSegment =
	| { type: "text"; content: string }
	| { type: "blank"; blankId: string; inputType: "dropdown" | "text"; choices?: string[] };

export interface TakerQuestion {
	id: string;
	type: TakerQuestionType;
	text: string;
	marks: number;
	options?: QuestionOption[];
	pairs?: MatchPair[];
	segments?: BlankSegment[];
}

export interface TakerSection {
	id: string;
	title: string;
	isComprehension?: boolean;
	isImageBased?: boolean;
	passage?: string;
	questions: TakerQuestion[];
}

export interface TestAttemptData {
	id: string;
	title: string;
	durationSeconds: number;
	sections: TakerSection[];
}

export type AnswerValue = string | string[] | Record<string, string>;
export type AnswerMap = Record<string, AnswerValue>;

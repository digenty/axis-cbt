// import { JwtPayload } from "jwt-decode";

// export type SchoolOption = "Primary School" | "Secondary School";
// export type Crumb = { label: string; url?: string };

// export enum BoardingStatus {
// 	Day = "DAY",
// 	Boarding = "BOARDING",
// }

// export enum AdmissionStatus {
// 	Graduated = "GRADUATED",
// 	Active = "ACTIVE",
// 	Suspended = "SUSPENDED",
// 	Withdrawn = "WITHDRAWN",
// 	Inactive = "INACTIVE",
// 	Total = "TOTAL",
// }

// export enum JoinedTermEnum {
// 	First = "FIRST",
// 	Second = "SECOND",
// 	Third = "THIRD",
// }

// export enum Gender {
// 	Male = "MALE",
// 	Female = "FEMALE",
// }

// export const genders = [
// 	{
// 		label: "Male",
// 		value: Gender.Male,
// 	},
// 	{
// 		label: "Female",
// 		value: Gender.Female,
// 	},
// ];

// export const terms = [
// 	{
// 		label: "First Term",
// 		value: "FIRST",
// 	},
// 	{
// 		label: "Second Term",
// 		value: "SECOND",
// 	},
// 	{
// 		label: "Third Term",
// 		value: "THIRD",
// 	},
// ];

// interface User {
// 	id: string;
// 	branchId: number;
// 	schoolId: number;
// 	permissions: string[];
// }

// export type JWTPayload = JwtPayload & User;

// export interface Pagination {
// 	limit: number;
// 	page: number;
// }

// export enum Relationship {
// 	Mother = "MOTHER",
// 	Father = "FATHER",
// 	Guardian = "GUARDIAN",
// }

// export const relationships = [
// 	{
// 		label: "Mother",
// 		value: Relationship.Mother,
// 	},
// 	{
// 		label: "Father",
// 		value: Relationship.Father,
// 	},
// 	{
// 		label: "Guardian",
// 		value: Relationship.Guardian,
// 	},
// ];

// export type QuestionType =
// 	| "multiple-choice"
// 	| "true-false"
// 	| "essay"
// 	| "fill-in-blank"
// 	| "matching"
// 	| "short-answer"
// 	| "numerical"
// 	| "question-group"
// 	| "multiple-answers"
// 	| "comprehension-passage"
// 	| "multiple-blanks";

// export interface Option {
// 	id: string;
// 	text: string;
// 	isCorrect?: boolean;
// }

// export interface Blank {
// 	id: string;
// 	label: string;
// 	answerType: "short-answer" | "multiple-choice";
// 	answers: string[];
// 	mark: number;
// 	options?: Option[];
// }

import { JwtPayload } from "jwt-decode";

interface JWTUser {
  id: number;
  schoolId: number;
  permissions: string[];
  armIds: number[];
  branchIds: number[];
  created: number;
  email: string;
  name: string;
  subjectIds: number[];
  isMain: boolean;
  isAdmin: boolean;
  adminBranchIds: number[];
}

export type JWTPayload = JwtPayload & JWTUser;

export type LevelType =
  | "CRECHE"
  | "KINDERGARTEN"
  | "NURSERY"
  | "PRIMARY"
  | "JUNIOR_SECONDARY"
  | "SENIOR_SECONDARY";

export interface QuestionMetadata {
  // Essay
  minWords?: number;
  maxWords?: number;
  modelAnswer?: string;
  rubric?: string;
  // Numeric
  tolerance?: number;
  minValue?: number;
  maxValue?: number;
  unit?: string;
  decimalPlaces?: number;
  // Multiple-answers
  minSelections?: number;
  maxSelections?: number;
  partialCredit?: boolean;
  // Match
  marksForEach?: number;
  shuffleItems?: boolean;
  // Short-answer / fill-in-blank
  caseSensitive?: boolean;
  exactMatch?: boolean;
  maxLength?: number;
  // Question-group / comprehension-passage
  stimulusType?: string;
}

export interface Question {
  id: string;
  topicId: number;
  type: QuestionType;
  text: string;
  marks: number;
  options?: Option[];
  correctAnswer?: string | string[];
  blanks?: Blank[];
  passage?: string;
  instruction?: string;
  subQuestions?: Question[];
  /** For matching questions: left column items */
  matchItems?: { id: string; text: string }[];
  /** For matching questions: right column options */
  matchOptions?: { id: string; text: string }[];
  /** Type-specific advanced metadata (round-tripped to API) */
  metadata?: QuestionMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  subjectId: number;
  questions: Question[];
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  classId: string;
  teacherId?: string;
  teacherName?: string;
  questionsInBank: number;
  tests: number;
  topics: Topic[];
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  school: string;
  level: string;
  subjects: Subject[];
  totalSubjects: number;
  createdAt: string;
}

// export interface Assessment {
// 	// title: string;
// 	// duration: number;
// 	// questions: string[];

// 	id: number;
// 	name: string;
// 	classId: number;
// 	subjectId: number;
// 	testType: "CONTINUOUS_ASSESSMENT" | "EXAM";
// 	term: "FIRST" | "SECOND" | "THIRD";
// 	status: "DRAFT" | "PUBLISHED" | "COMPLETED";
// 	durationMinutes: number;
// 	totalMarks: number;
// 	startDateTime: string;
// 	endDateTime: string;
// 	questionCount: number;
// }

// export interface Result {
// 	id: string;
// 	studentId: string;
// 	studentName: string;
// 	assessmentId: string;
// 	score: number;
// 	totalMarks: number;
// 	percentage: number;
// 	completedAt: string;
// }

// export interface QuestionGroupForm {
// 	name: string;
// 	passage: string;
// 	passageType: "comprehension-passage" | "multiple-blanks";
// 	instruction: string;
// 	questions: Partial<Question>[];
// }

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Blank {
  id: string;
  label: string;
  answerType: "short-answer" | "multiple-choice";
  answers: string[];
  mark: number;
  options?: Option[];
}

// export interface Subject {
// 	id: string;
// 	name: string;
// 	classId: string;
// 	teacherId?: string;
// 	teacherName?: string;
// 	questionsInBank: number;
// 	tests: number;
// 	topics: Topic[];
// 	createdAt: string;
// }

// export interface Class {
// 	id: string;
// 	name: string;
// 	school: string;
// 	level: string;
// 	subjects: Subject[];
// 	totalSubjects: number;
// 	createdAt: string;
// }

// // ─── Test / Assessment ────────────────────────────────────────────────────────

// export type TestStatus = "draft" | "published" | "completed";
// export type TestType = "Continuous Assessment" | "Examination";
// export type TermType = "First Term" | "Second Term" | "Third Term";
// export type AssessmentMapping =
// 	| "None ( Manual Scoring)"
// 	| "Continuous Assessment 1 (20%)"
// 	| "Continuous Assessment 2 (20%)"
// 	| "Examination (60%)";

// export interface TestSection {
// 	id: string;
// 	title: string;
// 	instruction: string;
// 	/** Ordered list of question IDs in this section */
// 	questionIds: string[];
// }

// export interface Result {
// 	id: string;
// 	studentId: string;
// 	studentName: string;
// 	assessmentId: string;
// 	score: number;
// 	totalMarks: number;
// 	percentage: number;
// 	completedAt: string;
// }

// export interface QuestionGroupForm {
// 	name: string;
// 	passage: string;
// 	passageType: "comprehension-passage" | "multiple-blanks";
// 	instruction: string;
// 	questions: Partial<Question>[];
// }

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "essay"
  | "fill-in-blank"
  | "matching"
  | "short-answer"
  | "numerical"
  | "question-group"
  | "multiple-answers"
  | "comprehension-passage"
  | "multiple-blanks";

// Re-export types from results.ts so "@/types" resolves everything
export type {
  Test,
  TestSection,
  TestStatus,
  TestType,
  TermType,
  AssessmentMapping,
  StudentAttempt,
  StudentAnswer,
  AttemptStatus,
  Assessment,
  Result,
} from "./results";

// export interface Option {
// 	id: string;
// 	text: string;
// 	isCorrect?: boolean;
// }

// export interface Blank {
// 	id: string;
// 	label: string;
// 	answerType: "short-answer" | "multiple-choice";
// 	answers: string[];
// 	mark: number;
// 	options?: Option[];
// }

// export interface Subject {
// 	id: string;
// 	name: string;
// 	classId: string;
// 	teacherId?: string;
// 	teacherName?: string;
// 	questionsInBank: number;
// 	tests: number;
// 	topics: Topic[];
// 	createdAt: string;
// }

// export interface ApiTopic {
// 	active: boolean;
// 	branchId: number;
// 	classId: number;
// 	createdAt: string;
// 	description: string;
// 	displayOrder: number;
// 	id: number;
// 	name: string;
// 	schoolId: number;
// 	subjectId: number;
// 	updatedAt: string;
// 	uuid: string;
// 	version: number;
// }

// export interface Class {
// 	id: string;
// 	name: string;
// 	school: string;
// 	level: string;
// 	subjects: Subject[];
// 	totalSubjects: number;
// 	createdAt: string;
// }

// // ─── Test / Assessment ────────────────────────────────────────────────────────

// // export type TestStatus = "draft" | "published" | "completed";
// // export type TestType = "Continuous Assessment" | "Examination";
// // export type TermType = "First Term" | "Second Term" | "Third Term";
// // export type AssessmentMapping =
// // 	| "None ( Manual Sccoring)"
// // 	| "Continuous Assessment 1 (20%)"
// // 	| "Continuous Assessment 2 (20%)"
// // 	| "Examination (60%)";

// export interface TestSection {
// 	id: string;
// 	title: string;
// 	instruction: string;
// 	questionIds: string[];
// }

// export interface Test {
// 	id: string;
// 	title: string;
// 	subjectId: number;
// 	classId: number;
// 	term: TermType;
// 	testType: TestType;
// 	assessmentMapping: AssessmentMapping | "";
// 	/** label shown as badge e.g. "CA 1" */
// 	mappingLabel: string;
// 	testDate: string;
// 	startTime: string;
// 	amPm: "AM" | "PM";
// 	duration: number;
// 	studentResultAccess: boolean;
// 	status: TestStatus;
// 	sections: TestSection[];
// 	totalMarks: number;
// 	createdAt: string;
// 	updatedAt: string;
// }

// // ─── Student Attempts & Results ───────────────────────────────────────────────

// export type AttemptStatus =
// 	| "in-progress"
// 	| "submitted"
// 	| "missed"
// 	| "graded"
// 	| "retake-pending";

// /** One student's answer to one question */
// export interface StudentAnswer {
// 	questionId: string;
// 	/** For MCQ / T-F: selected option ID(s) */
// 	selectedOptionIds?: string[];
// 	/** For short-answer / essay / fill-in-blank / numerical */
// 	textAnswer?: string;
// 	/** For matching: map from matchItem.id → matchOption.id */
// 	matchAnswers?: Record<string, string>;
// 	/** For multiple-blanks: map from blank.id → answer */
// 	blankAnswers?: Record<string, string | string[]>;
// 	/** Teacher-assigned marks for this question (overrides auto-grade) */
// 	awardedMarks?: number;
// }

// export interface StudentAttempt {
// 	id: string;
// 	testId: string;
// 	subjectId: string;
// 	classId: string;
// 	studentId: string;
// 	studentName: string;
// 	studentClass: string;
// 	studentAvatar?: string;
// 	status: AttemptStatus;
// 	answers: StudentAnswer[];
// 	/** Raw score out of test totalMarks */
// 	score?: number;
// 	totalMarks?: number;
// 	percentage?: number;
// 	/** Weighted score after applying assessmentMapping weight */
// 	weightedScore?: number;
// 	feedback?: string;
// 	startedAt: string;
// 	submittedAt?: string;
// 	gradedAt?: string;
// }

// export interface Result {
// 	id: string;
// 	studentId: string;
// 	studentName: string;
// 	assessmentId: string;
// 	score: number;
// 	totalMarks: number;
// 	percentage: number;
// 	completedAt: string;
// }

// export interface QuestionGroupForm {
// 	name: string;
// 	passage: string;
// 	passageType: "comprehension-passage" | "multiple-blanks";
// 	instruction: string;
// 	questions: Partial<Question>[];
// }

// export type LevelType =
// 	| "CRECHE"
// 	| "KINDERGARTEN"
// 	| "NURSERY"
// 	| "PRIMARY"
// 	| "JUNIOR_SECONDARY"
// 	| "SENIOR_SECONDARY";

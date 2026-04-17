// ─── Enums ────────────────────────────────────────────────────────────────────

export type AssessmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ONGOING"
  | "COMPLETED"
  | "ARCHIVED";

export type AssessmentTerm = "1" | "2" | "3";

export type AssessmentTestType =
  | "CONTINUOUS_ASSESSMENT"
  | "EXAMINATION"
  | "MOCK_EXAM"
  | "PRACTICE_TEST";

export type AssessmentMapping =
  | "NONE_MANUAL_SCORING"
  | "CONTINUOUS_ASSESSMENT_1_20_PERCENT"
  | "CONTINUOUS_ASSESSMENT_2_20_PERCENT"
  | "EXAMINATION_60_PERCENT"
  | "CUSTOM";

// ─── Display labels ───────────────────────────────────────────────────────────

export const ASSESSMENT_TERM_LABELS: Record<AssessmentTerm, string> = {
  "1": "First Term",
  "2": "Second Term",
  "3": "Third Term",
};

export const ASSESSMENT_TEST_TYPE_LABELS: Record<AssessmentTestType, string> = {
  CONTINUOUS_ASSESSMENT: "Continuous Assessment",
  EXAMINATION: "Examination",
  MOCK_EXAM: "Mock Exam",
  PRACTICE_TEST: "Practice Test",
};

export const ASSESSMENT_MAPPING_LABELS: Record<AssessmentMapping, string> = {
  NONE_MANUAL_SCORING: "None / Manual Scoring",
  CONTINUOUS_ASSESSMENT_1_20_PERCENT: "CA 1 (20%)",
  CONTINUOUS_ASSESSMENT_2_20_PERCENT: "CA 2 (20%)",
  EXAMINATION_60_PERCENT: "Examination (60%)",
  CUSTOM: "Custom",
};

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

// ─── Shorthand aliases ────────────────────────────────────────────────────────

export const TERM_LABELS = ASSESSMENT_TERM_LABELS;
export const TEST_TYPE_LABELS = ASSESSMENT_TEST_TYPE_LABELS;
export const MAPPING_LABELS = ASSESSMENT_MAPPING_LABELS;

export const MAPPING_SHORT: Record<AssessmentMapping, string> = {
  NONE_MANUAL_SCORING: "Manual",
  CONTINUOUS_ASSESSMENT_1_20_PERCENT: "CA1",
  CONTINUOUS_ASSESSMENT_2_20_PERCENT: "CA2",
  EXAMINATION_60_PERCENT: "Exam 60%",
  CUSTOM: "Custom",
};

export const ASSESSMENT_STATUS_BADGE: Record<AssessmentStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
  PUBLISHED: "bg-green-50 text-green-700 border-green-200",
  ONGOING: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-purple-50 text-purple-700 border-purple-200",
  ARCHIVED: "bg-amber-50 text-amber-700 border-amber-200",
};

// ─── API Response ─────────────────────────────────────────────────────────────
// All fields camelCase — matching the swagger response schema exactly.

export interface ApiAssessment {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;

  name: string;
  classId: number;
  subjectId: number;
  branchId: number;
  schoolId: number;

  term: AssessmentTerm;
  testType: AssessmentTestType;
  assessmentMapping: AssessmentMapping;
  status: AssessmentStatus;

  durationMinutes: number | null;
  totalMarks: number;
  passingMarks: number | null;

  startDateTime: string | null;
  endDateTime: string | null;
  instructions: string | null;

  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
}

// ─── Request payload (POST / PUT body) ───────────────────────────────────────

export interface CreateAssessmentPayload {
  name: string;
  branchId: number;
  classId: number;
  subjectId: number;
  schoolId?: number;
  term: AssessmentTerm;
  testType: AssessmentTestType;
  assessmentMapping: AssessmentMapping;

  startDateTime?: string | null;
  endDateTime?: string | null;
  durationMinutes?: number | null;

  totalMarks?: number;
  passingMarks?: number | null;

  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showResultsImmediately?: boolean;
  allowReview?: boolean;

  instructions?: string | null;
}

export type UpdateAssessmentPayload = Partial<CreateAssessmentPayload>;

// ─── API response wrappers ────────────────────────────────────────────────────

export interface AssessmentResponse {
  data: ApiAssessment;
  message: string;
  status: string;
}

export interface AssessmentsListResponse {
  data: ApiAssessment[];
  message: string;
  status: string;
}

// ─── UI form state ────────────────────────────────────────────────────────────

export interface AssessmentFormState {
  name: string;
  term: AssessmentTerm | "";
  testType: AssessmentTestType | "";
  assessmentMapping: AssessmentMapping | "";
  startDateTime: string;
  endDateTime: string;
  durationMinutes: string;
  totalMarks: string;
  passingMarks: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
  instructions: string;
}

export const ASSESSMENT_FORM_INITIAL: AssessmentFormState = {
  name: "",
  term: "",
  testType: "",
  assessmentMapping: "",
  startDateTime: "",
  endDateTime: "",
  durationMinutes: "",
  totalMarks: "",
  passingMarks: "",
  shuffleQuestions: false,
  shuffleOptions: false,
  showResultsImmediately: false,
  allowReview: false,
  instructions: "",
};

// ─── Summary shape (list view) ────────────────────────────────────────────────

export interface ApiAssessmentSummary extends ApiAssessment {
  questionCount?: number;
}

// ─── Section types ────────────────────────────────────────────────────────────

import type { ApiQuestion } from "@/types/question";

export interface ApiSectionQuestion {
  aqId: number;
  question: ApiQuestion;
}

export interface ApiSection {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  assessmentId: number;
  name: string;
  instructions: string | null;
  sectionOrder: number;
  timeLimitMinutes: number;
}

export interface CreateSectionPayload {
  name: string;
  instructions?: string;
  sectionOrder: number;
  timeLimitMinutes?: number;
  questionIds?: number[];
}

export interface SectionResponse {
  data: ApiSection;
  message: string;
  status: string;
}

export interface SectionsListResponse {
  data: ApiSection[];
  message: string;
  status: string;
}

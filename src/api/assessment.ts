import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
  AssessmentDetailResponse,
  AssessmentEnrollmentResponse,
  AssessmentListResponse,
  AssessmentResponse,
  AssessmentResultsResponse,
  AssessmentSettingsListResponse,
  AssessmentStatsResponse,
  CreateAssessmentPayload,
  CreateSectionPayload,
  GradeManuallyPayload,
  SectionResponse,
  SectionsResponse,
  StudentAttemptAnswersResponse,
  UpdateAssessmentPayload,
  UpdateSectionPayload,
} from "@/types/question";
import type { SubmitAnswerPayload } from "@/types/student-api";

// ─── Assessment settings (school-level CA/Exam definitions per class) ─────────

export const getAssessmentSettingsByClass = async (
  classId: number,
): Promise<AssessmentSettingsListResponse> => {
  try {
    const { data } = await api.get(`/assessments/class?classId=${classId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Assessments ──────────────────────────────────────────────────────────────

export const getAssessments = async (payload: {
  branchId: number;
  classId?: number;
  subjectId?: number;
}): Promise<AssessmentListResponse> => {
  try {
    const params = new URLSearchParams();
    params.set("branchId", String(payload.branchId));
    if (payload.classId !== undefined)
      params.set("classId", String(payload.classId));
    if (payload.subjectId !== undefined)
      params.set("subjectId", String(payload.subjectId));
    const { data } = await api.get(`/api/cbt/assessments?${params.toString()}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAssessment = async (
  assessmentId: number,
): Promise<AssessmentDetailResponse> => {
  try {
    const { data } = await api.get(`/api/cbt/assessments/${assessmentId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteAssessment = async (
  assessmentId: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(`/api/cbt/assessments/${assessmentId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createAssessment = async (
  payload: CreateAssessmentPayload,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.post("/api/cbt/assessments", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateAssessment = async (
  assessmentId: number,
  payload: UpdateAssessmentPayload,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.put(
      `/api/cbt/assessments/${assessmentId}`,
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const publishAssessment = async (
  assessmentId: number,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.post(
      `/api/cbt/assessments/${assessmentId}/publish`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Sections ─────────────────────────────────────────────────────────────────

export const getAssessmentSections = async (
  assessmentId: number,
): Promise<SectionsResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/assessments/${assessmentId}/sections`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addSection = async (
  assessmentId: number,
  payload: CreateSectionPayload,
): Promise<SectionResponse> => {
  try {
    const { data } = await api.post(
      `/api/cbt/assessments/${assessmentId}/sections`,
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteSection = async (
  assessmentId: number,
  sectionId: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(
      `/api/cbt/assessments/${assessmentId}/sections/${sectionId}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateSection = async (
  sectionId: number,
  payload: UpdateSectionPayload,
): Promise<SectionResponse> => {
  try {
    const { data } = await api.put(
      `/api/cbt/assessments/sections/${sectionId}`,
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Section questions ────────────────────────────────────────────────────────

export const addQuestionsToSection = async (
  sectionId: number,
  questionIds: number[],
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.post(
      `/api/cbt/assessments/sections/${sectionId}/questions`,
      questionIds,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const removeQuestionFromSection = async (
  assessmentQuestionId: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(
      `/api/cbt/assessments/assessment-questions/${assessmentQuestionId}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Results & grading ────────────────────────────────────────────────────────

export const getAssessmentEnrollment = async (
  assessmentId: number,
): Promise<AssessmentEnrollmentResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/assessments/${assessmentId}/enrollment`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStudentAttemptAnswers = async (
  studentAssessmentId: number,
): Promise<StudentAttemptAnswersResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/assessments/student-attempts/${studentAssessmentId}/answers`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const submitAnswersBatch = async (
  payload: SubmitAnswerPayload[],
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.post(
      "/api/cbt/assessments/answers/batch",
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAssessmentResults = async (
  assessmentId: number,
): Promise<AssessmentResultsResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/assessments/${assessmentId}/results`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAssessmentStats = async (
  assessmentId: number,
): Promise<AssessmentStatsResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/assessments/${assessmentId}/stats`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const gradeManually = async (
  payload: GradeManuallyPayload,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.post(
      "/api/cbt/assessments/grade-manually",
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

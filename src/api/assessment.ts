import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
  AssessmentListResponse,
  AssessmentResponse,
  AssessmentResultsResponse,
  AssessmentStatsResponse,
  CreateAssessmentPayload,
  CreateSectionPayload,
  GradeManuallyPayload,
  SectionResponse,
  SectionsResponse,
  UpdateAssessmentPayload,
} from "@/types/question";

// ─── Assessments ──────────────────────────────────────────────────────────────

export const getAssessments = async (payload: {
  branchId: number;
  classId: number;
  subjectId: number;
}): Promise<AssessmentListResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/assessments?classId=${payload.classId}&subjectId=${payload.subjectId}&branchId=${payload.branchId}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAssessment = async (
  assessmentId: number,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.get(`/api/cbt/assessments/${assessmentId}`);
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

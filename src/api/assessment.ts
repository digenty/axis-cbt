import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
<<<<<<< HEAD
  AssessmentResponse,
  AssessmentsListResponse,
  CreateAssessmentPayload,
  CreateSectionPayload,
  SectionResponse,
  SectionsListResponse,
  UpdateAssessmentPayload,
} from "@/types/assessment";

// ─── List ─────────────────────────────────────────────────────────────────────

export const getAssessments = async (params: {
  branchId: number;
  classId?: number;
  subjectId?: number;
}): Promise<AssessmentsListResponse> => {
  try {
    const query = new URLSearchParams();
    query.set("branchId", String(params.branchId));
    if (params.classId) query.set("classId", String(params.classId));
    if (params.subjectId) query.set("subjectId", String(params.subjectId));
    const { data } = await api.get(`/api/cbt/assessments?${query.toString()}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Single ───────────────────────────────────────────────────────────────────

export const getAssessment = async (
  id: number,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.get(`/api/cbt/assessments/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createAssessment = async (
  payload: CreateAssessmentPayload,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.post("/api/cbt/assessments", payload);
    return data;
  } catch (error) {
=======
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
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

<<<<<<< HEAD
// ─── Update ───────────────────────────────────────────────────────────────────

export const updateAssessment = async (
  id: number,
  payload: UpdateAssessmentPayload,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.put(`/api/cbt/assessments/${id}`, payload);
    return data;
  } catch (error) {
=======
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
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

<<<<<<< HEAD
// ─── Publish ──────────────────────────────────────────────────────────────────

export const publishAssessment = async (
  id: number,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.post(`/api/cbt/assessments/${id}/publish`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteAssessment = async (
  id: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(`/api/cbt/assessments/${id}`);
    return data;
  } catch (error) {
=======
export const publishAssessment = async (
  assessmentId: number,
): Promise<AssessmentResponse> => {
  try {
    const { data } = await api.post(
      `/api/cbt/assessments/${assessmentId}/publish`,
    );
    return data;
  } catch (error: unknown) {
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Sections ─────────────────────────────────────────────────────────────────

<<<<<<< HEAD
export const getSections = async (
  assessmentId: number,
): Promise<SectionsListResponse> => {
=======
export const getAssessmentSections = async (
  assessmentId: number,
): Promise<SectionsResponse> => {
>>>>>>> new-cbt
  try {
    const { data } = await api.get(
      `/api/cbt/assessments/${assessmentId}/sections`,
    );
    return data;
<<<<<<< HEAD
  } catch (error) {
=======
  } catch (error: unknown) {
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

<<<<<<< HEAD
export const createSection = async (
=======
export const addSection = async (
>>>>>>> new-cbt
  assessmentId: number,
  payload: CreateSectionPayload,
): Promise<SectionResponse> => {
  try {
    const { data } = await api.post(
      `/api/cbt/assessments/${assessmentId}/sections`,
      payload,
    );
    return data;
<<<<<<< HEAD
  } catch (error) {
=======
  } catch (error: unknown) {
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteSection = async (
<<<<<<< HEAD
=======
  assessmentId: number,
>>>>>>> new-cbt
  sectionId: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(
<<<<<<< HEAD
      `/api/cbt/assessments/sections/${sectionId}`,
    );
    return data;
  } catch (error) {
=======
      `/api/cbt/assessments/${assessmentId}/sections/${sectionId}`,
    );
    return data;
  } catch (error: unknown) {
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

<<<<<<< HEAD
export const addQuestionsToSection = async (
  sectionId: number,
  questionIds: number[],
): Promise<void> => {
  try {
    await api.post(
      `/api/cbt/assessments/sections/${sectionId}/questions`,
      questionIds,
    );
  } catch (error) {
=======
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
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

<<<<<<< HEAD
export const deleteAssessmentQuestion = async (
  aqId: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(
      `/api/cbt/assessments/assessment-questions/${aqId}`,
    );
    return data;
  } catch (error) {
=======
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
>>>>>>> new-cbt
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

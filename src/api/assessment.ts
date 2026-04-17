import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
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
		const { data } = await api.get(
			`/api/cbt/assessments?${query.toString()}`,
		);
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
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateAssessment = async (
	id: number,
	payload: UpdateAssessmentPayload,
): Promise<AssessmentResponse> => {
	try {
		const { data } = await api.put(`/api/cbt/assessments/${id}`, payload);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

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
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

// ─── Sections ─────────────────────────────────────────────────────────────────

export const getSections = async (
	assessmentId: number,
): Promise<SectionsListResponse> => {
	try {
		const { data } = await api.get(
			`/api/cbt/assessments/${assessmentId}/sections`,
		);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const createSection = async (
	assessmentId: number,
	payload: CreateSectionPayload,
): Promise<SectionResponse> => {
	try {
		const { data } = await api.post(
			`/api/cbt/assessments/${assessmentId}/sections`,
			payload,
		);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const deleteSection = async (
	sectionId: number,
): Promise<{ message: string; status: string }> => {
	try {
		const { data } = await api.delete(
			`/api/cbt/assessments/sections/${sectionId}`,
		);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

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
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const deleteAssessmentQuestion = async (
	aqId: number,
): Promise<{ message: string; status: string }> => {
	try {
		const { data } = await api.delete(
			`/api/cbt/assessments/assessment-questions/${aqId}`,
		);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

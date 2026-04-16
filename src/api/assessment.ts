import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
	AssessmentResponse,
	AssessmentsListResponse,
	CreateAssessmentPayload,
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
	uuid: string,
): Promise<AssessmentResponse> => {
	try {
		const { data } = await api.get(`/api/cbt/assessments/${uuid}`);
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
	uuid: string,
	payload: UpdateAssessmentPayload,
): Promise<AssessmentResponse> => {
	try {
		const { data } = await api.put(`/api/cbt/assessments/${uuid}`, payload);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

// ─── Publish ──────────────────────────────────────────────────────────────────

export const publishAssessment = async (
	uuid: string,
): Promise<AssessmentResponse> => {
	try {
		const { data } = await api.post(`/api/cbt/assessments/${uuid}/publish`);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteAssessment = async (
	uuid: string,
): Promise<{ message: string; status: string }> => {
	try {
		const { data } = await api.delete(`/api/cbt/assessments/${uuid}`);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

// import api from "@/lib/axios-auth";
// import { isAxiosError } from "axios";
// import type {
// 	ApiAssessment,
// 	ApiAssessmentSummary,
// 	CreateAssessmentPayload,
// } from "@/types/assessment";

// export type CbtQueBankTopicPayload = {
// 	name: string;
// 	classId: number;
// 	subjectId: number;
// 	branchId: number;
// 	description: string;
// 	displayOrder: number;
// 	id?: number;
// };

// export type AddAssessmentRequest = {
// 	id: number;
// 	name: string;
// 	classId: number;
// 	subjectId: number;
// 	branchId: number;
// 	term: string;
// 	testType: string;
// 	assessmentMapping: string;
// 	durationMinutes: number;
// 	totalMarks: number;
// 	passingMarks: number;
// 	startDateTime: string;
// 	endDateTime: string;
// 	instructions: string;
// 	shuffleQuestions: boolean;
// 	shuffleOptions: boolean;
// 	showResultsImmediately: boolean;
// 	allowReview: boolean;
// 	createdBy: number;
// 	sections: [
// 		{
// 			id: number;
// 			name: string;
// 			instructions: string;
// 			sectionOrder: number;
// 			timeLimitMinutes: number;
// 			questionIds: number;
// 		},
// 	];
// };

// // ─── GET /api/cbt/assessments ─────────────────────────────────────────────────

// export const getAssessments = async (params: {
// 	branchId: number;
// 	classId: number;
// 	subjectId: number;
// }): Promise<ApiAssessmentSummary[]> => {
// 	try {
// 		const { data } = await api.get("/api/cbt/assessments", { params });
// 		return data;
// 	} catch (error) {
// 		if (isAxiosError(error)) throw error.response?.data;
// 		throw error;
// 	}
// };

// // ─── GET /api/cbt/assessments/{id} ───────────────────────────────────────────

// export const getAssessment = async (id: number): Promise<ApiAssessment> => {
// 	try {
// 		const { data } = await api.get(`/api/cbt/assessments/${id}`);
// 		return data;
// 	} catch (error) {
// 		if (isAxiosError(error)) throw error.response?.data;
// 		throw error;
// 	}
// };

// // ─── POST /api/cbt/assessments ───────────────────────────────────────────────

// export const createAssessment = async (
// 	payload: CreateAssessmentPayload,
// ): Promise<ApiAssessment> => {
// 	try {
// 		const { data } = await api.post("/api/cbt/assessments", payload);
// 		return data;
// 	} catch (error) {
// 		if (isAxiosError(error)) throw error.response?.data;
// 		throw error;
// 	}
// };

// // ─── PUT /api/cbt/assessments/{id} ───────────────────────────────────────────

// export const updateAssessment = async (
// 	id: number,
// 	payload: CreateAssessmentPayload,
// ): Promise<ApiAssessment> => {
// 	try {
// 		const { data } = await api.put(`/api/cbt/assessments/${id}`, payload);
// 		return data;
// 	} catch (error) {
// 		if (isAxiosError(error)) throw error.response?.data;
// 		throw error;
// 	}
// };

// // ─── POST /api/cbt/assessments/{id}/publish ──────────────────────────────────

// export const publishAssessment = async (id: number): Promise<ApiAssessment> => {
// 	try {
// 		const { data } = await api.post(`/api/cbt/assessments/${id}/publish`);
// 		return data;
// 	} catch (error) {
// 		if (isAxiosError(error)) throw error.response?.data;
// 		throw error;
// 	}
// };

// // ─── DELETE /api/cbt/assessments/assessment-questions/{aqId} ─────────────────

// export const deleteAssessmentQuestion = async (aqId: number): Promise<void> => {
// 	try {
// 		await api.delete(`/api/cbt/assessments/assessment-questions/${aqId}`);
// 	} catch (error) {
// 		if (isAxiosError(error)) throw error.response?.data;
// 		throw error;
// 	}
// };

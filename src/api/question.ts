import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
	CbtQueBankTopicPayload,
	CreateQuestionPayload,
	ImportQuestionsResult,
	QuestionResponse,
	QuestionsListResponse,
	TopicResponse,
	TopicsResponse,
} from "@/types/question";

// ─── Topics ───────────────────────────────────────────────────────────────────

export const getCbtQuestionBankTopics = async (payload: {
	classId?: number;
	subjectId?: number;
}): Promise<TopicsResponse> => {
	try {
		const { data } = await api.get(
			`/api/cbt/question-bank/topics?classId=${payload?.classId}&subjectId=${payload?.subjectId}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const addCbtQuestionBankTopic = async (
	payload: CbtQueBankTopicPayload,
): Promise<TopicResponse> => {
	try {
		const { data } = await api.post("/api/cbt/question-bank/topics", payload);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const updateCbtQuestionBankTopic = async (
	id: number,
	payload: Partial<CbtQueBankTopicPayload>,
): Promise<TopicResponse> => {
	try {
		const { data } = await api.put(
			`/api/cbt/question-bank/topics/${id}`,
			payload,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const deleteCbtQuestionBankTopic = async (
	id: number,
): Promise<{ message: string; status: string }> => {
	try {
		const { data } = await api.delete(`/api/cbt/question-bank/topics/${id}`);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

// ─── Questions ────────────────────────────────────────────────────────────────

export const getCbtQuestions = async (payload: {
	classId: number;
	subjectId: number;
	topicId?: number;
}): Promise<QuestionsListResponse> => {
	try {
		const params = new URLSearchParams();
		if (payload?.topicId) params.set("topicId", String(payload?.topicId));

		const { data } = await api.get(
			`/api/cbt/question-bank/questions/classes/${payload?.classId}/subjects/${payload?.subjectId}?${params.toString()}`,
		);

		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const getCbtQuestion = async (id: number): Promise<QuestionResponse> => {
	try {
		const { data } = await api.get(`/api/cbt/question-bank/questions/${id}`);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const createCbtQuestion = async (
	payload: CreateQuestionPayload,
): Promise<QuestionResponse> => {
	try {
		const { data } = await api.post(
			"/api/cbt/question-bank/questions",
			payload,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const updateCbtQuestion = async (
	id: number,
	// Accepts the full payload — do NOT spread `id` into the body, the backend
	// reads it from the path param and the body `id` field confuses the deserialiser.
	payload: CreateQuestionPayload,
): Promise<QuestionResponse> => {
	try {
		const { data } = await api.put(
			`/api/cbt/question-bank/questions/${id}`,
			payload, // ← clean body, no extra `id` field
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const deleteCbtQuestion = async (
	id: number,
): Promise<{ message: string; status: string }> => {
	try {
		const { data } = await api.delete(
			`/api/cbt/question-bank/questions/${id}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const importCbtQuestions = async (payload: {
	classId: number;
	subjectId: number;
	file: File;
}): Promise<{ data: ImportQuestionsResult; message: string }> => {
	try {
		const formData = new FormData();
		formData.append("file", payload?.file);
		const { data } = await api.post(
			`/api/cbt/question-bank/questions/import?classId=${payload?.classId}&subjectId=${payload?.subjectId}`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
		return data;
	} catch (error) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

import api from "@/lib/axios-auth";
import {
	CbtQueBankTopicPayload,
	CreateQuestionPayload,
	QuestionResponse,
	QuestionsListResponse,
	TopicResponse,
	TopicsResponse,
} from "@/types/question";
import { isAxiosError } from "axios";

export const getCbtQuestionBankTopics = async (payload: {
	classId?: number;
	subjectId?: number;
}): Promise<TopicsResponse> => {
	try {
		const { data } = await api.get(
			`/api/cbt/question-bank/topics?classId=${payload.classId}&subjectId=${payload.subjectId}`,
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

export const getCbtQuestions = async (payload: {
	classId: number;
	subjectId: number;
	topicId?: number;
}): Promise<QuestionsListResponse> => {
	try {
		const params = new URLSearchParams();
		if (payload.topicId) params.set("topicId", String(payload.topicId));

		console.log({ payload });

		const { data } = await api.get(
			`/api/cbt/question-bank/questions/classes/${payload.classId}/subjects/${payload.subjectId}?${params.toString()}`,
		);
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
	payload: Partial<CreateQuestionPayload>,
): Promise<QuestionResponse> => {
	try {
		const { data } = await api.put(`/api/cbt/question-bank/questions/${id}`, {
			...payload,
			id,
		});
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

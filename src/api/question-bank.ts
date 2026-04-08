import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";

export type CbtQueBankTopicPayload = {
	name: string;
	classId: number;
	subjectId: number;
	branchId: number;
	description: string;
	displayOrder: number;
	id?: number;
};

export const getCbtQuestionBankTopics = async (payload: {
	classId?: number;
	subjectId?: number;
}) => {
	try {
		const { data } = await api.get(
			`/api/cbt/question-bank/topics?classId=${payload?.classId}&subjectId=${payload?.subjectId}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const addCbtQuestionBankTopics = async (
	payload: CbtQueBankTopicPayload,
) => {
	try {
		const { data } = await api.post("/api/cbt/question-bank/topics", payload);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

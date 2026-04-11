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

export type AddAssessmentRequest = {
	id: number;
	name: string;
	classId: number;
	subjectId: number;
	branchId: number;
	term: string;
	testType: string;
	assessmentMapping: string;
	durationMinutes: number;
	totalMarks: number;
	passingMarks: number;
	startDateTime: string;
	endDateTime: string;
	instructions: string;
	shuffleQuestions: boolean;
	shuffleOptions: boolean;
	showResultsImmediately: boolean;
	allowReview: boolean;
	createdBy: number;
	sections: [
		{
			id: number;
			name: string;
			instructions: string;
			sectionOrder: number;
			timeLimitMinutes: number;
			questionIds: number;
		},
	];
};

export const getAssessments = async (payload: {
	branchId: number;
	classId: number;
	subjectId: number;
}) => {
	try {
		const { data } = await api.get(
			`/api/cbt/assessments?classId=${payload?.classId}&subjectId=${payload?.subjectId}&branchId=${payload?.branchId}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const addAssessment = async (payload: AddAssessmentRequest) => {
	try {
		const { data } = await api.post("/api/cbt/assessments", payload);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

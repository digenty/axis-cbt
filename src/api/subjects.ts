/**
 * CBT Subjects API
 * Mirrors the pattern from the main app's subjects.ts
 */
import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ApiSubject {
	id: number;
	name: string;
	classId: number;
	className?: string;
	teacherId?: number;
	teacherName?: string;
	questionsInBank?: number;
	tests?: number;
}

export interface TeacherSubjectsResponse {
	data: ApiSubject[];
	message: string;
	status: string;
}

// ── API calls ──────────────────────────────────────────────────────────────────

export const getTeacherSubjects = async () => {
	try {
		const { data } = await api.get("/teacher/subject/my");
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

export const getSubjectsByClass = async (
	className?: string,
	levelType?: string,
	branchId?: number,
): Promise<TeacherSubjectsResponse> => {
	try {
		const { data } = await api.get<TeacherSubjectsResponse>(
			`/subjects/class?className=${className}&levelType=${levelType}${branchId ? `&branchId=${branchId}` : ""}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) throw error.response?.data;
		throw error;
	}
};

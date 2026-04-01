"use client";

import api from "@/lib/axios-auth";
import { LevelType } from "@/types";
import { isAxiosError } from "axios";

type AddSubjectPayload = {
	names: string[];
	levelType: LevelType;
	branchId?: number;
	branchSpecific: boolean;
};

type AddSubjectToClassPayload = {
	names: string[];
	className: string;
	levelType: string;
};

export const getTeacherSubjects = async () => {
	try {
		const data = await api.get("/teacher/subject/my");

		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const getSubjectStudents = async (subjectId: number, armId: number) => {
	try {
		const data = await api.get(
			`/report/subject/${subjectId}/arm/${armId}?page=0&size=100`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const getBranchTeachersClassSubjects = async (armId: number) => {
	try {
		const data = await api.get(`/report/subject/arm/${armId}?page=0&size=15`);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const getSubjectsByLevel = async (
	levelType?: LevelType,
	branchId?: number,
) => {
	try {
		const { data } = await api.get(
			`/subjects/level?levelType=${levelType}${branchId ? `&branchId=${branchId}` : ""}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const addSubject = async (payload: AddSubjectPayload) => {
	try {
		const { data } = await api.post("/subjects/level", payload);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const deleteSubjectByLevel = async (
	subjectId: number,
	levelId: number,
) => {
	try {
		const { data } = await api.delete(
			`/subjects/level?subjectId=${subjectId}&levelId=${levelId}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const addSubjectToClass = async (payload: AddSubjectToClassPayload) => {
	try {
		const { data } = await api.post("/subjects/class", payload);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const getSubjectsByClass = async (
	className?: string,
	levelType?: string,
	branchId?: number,
) => {
	try {
		const { data } = await api.get(
			`/subjects/class?className=${className}&levelType=${levelType}${branchId ? `&branchId=${branchId}` : ""}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

export const deleteSubjectFromClass = async (
	subjectId: number,
	classId: number,
) => {
	try {
		const { data } = await api.delete(
			`/subjects/class?subjectId=${subjectId}&classId=${classId}`,
		);
		return data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			throw error.response?.data;
		}
		throw error;
	}
};

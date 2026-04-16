import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAssessment,
	deleteAssessment,
	getAssessment,
	getAssessments,
	publishAssessment,
	updateAssessment,
} from "@/api/assessment";
import type {
	CreateAssessmentPayload,
	UpdateAssessmentPayload,
} from "@/types/assessment";

// ─── Query key factory ────────────────────────────────────────────────────────

export const assessmentKeys = {
	list: (branchId: number, classId?: number, subjectId?: number) =>
		["assessments", branchId, classId, subjectId] as const,
	detail: (uuid: string) => ["assessments", uuid] as const,
};

// ─── List ─────────────────────────────────────────────────────────────────────

export const useGetAssessments = (params: {
	branchId: number;
	classId?: number;
	subjectId?: number;
}) => {
	return useQuery({
		queryKey: assessmentKeys.list(
			params.branchId,
			params.classId,
			params.subjectId,
		),
		queryFn: () => getAssessments(params),
		enabled: !!params.branchId,
		staleTime: 1000 * 60 * 2,
	});
};

// ─── Single ───────────────────────────────────────────────────────────────────

export const useGetAssessment = (uuid: string) => {
	return useQuery({
		queryKey: assessmentKeys.detail(uuid),
		queryFn: () => getAssessment(uuid),
		enabled: !!uuid,
	});
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const useCreateAssessment = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateAssessmentPayload) =>
			createAssessment(payload),
		onSuccess: (_, vars) => {
			qc.invalidateQueries({
				queryKey: ["assessments", vars.branchId],
			});
		},
	});
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const useUpdateAssessment = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			uuid,
			payload,
		}: {
			uuid: string;
			payload: UpdateAssessmentPayload;
		}) => updateAssessment(uuid, payload),
		onSuccess: (res) => {
			const a = res.data;
			qc.invalidateQueries({ queryKey: ["assessments", a.branchId] });
			qc.invalidateQueries({ queryKey: assessmentKeys.detail(a.uuid) });
		},
	});
};

// ─── Publish ──────────────────────────────────────────────────────────────────

export const usePublishAssessment = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (uuid: string) => publishAssessment(uuid),
		onSuccess: (res) => {
			const a = res.data;
			qc.invalidateQueries({ queryKey: ["assessments", a.branchId] });
			qc.invalidateQueries({ queryKey: assessmentKeys.detail(a.uuid) });
		},
	});
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const useDeleteAssessment = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (uuid: string) => deleteAssessment(uuid),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["assessments"] });
		},
	});
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addQuestionsToSection,
  createAssessment,
  createSection,
  deleteAssessment,
  deleteAssessmentQuestion,
  deleteSection,
  getAssessment,
  getAssessments,
  getSections,
  publishAssessment,
  updateAssessment,
} from "@/api/assessment";
import type {
  CreateAssessmentPayload,
  CreateSectionPayload,
  UpdateAssessmentPayload,
} from "@/types/assessment";

// ─── Query key factory ────────────────────────────────────────────────────────

export const assessmentKeys = {
  list: (branchId: number, classId?: number, subjectId?: number) =>
    ["assessments", branchId, classId, subjectId] as const,
  detail: (id: number) => ["assessments", id] as const,
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

export const useGetAssessment = (id: number) => {
  return useQuery({
    queryKey: assessmentKeys.detail(id),
    queryFn: () => getAssessment(id),
    enabled: !!id,
  });
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const useCreateAssessment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssessmentPayload) => createAssessment(payload),
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
      id,
      payload,
    }: {
      id: number;
      payload: UpdateAssessmentPayload;
    }) => updateAssessment(id, payload),
    onSuccess: (res) => {
      const a = res.data;
      qc.invalidateQueries({ queryKey: ["assessments", a.branchId] });
      qc.invalidateQueries({ queryKey: assessmentKeys.detail(a.id) });
    },
  });
};

// ─── Publish ──────────────────────────────────────────────────────────────────

export const usePublishAssessment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishAssessment(id),
    onSuccess: (res) => {
      const a = res.data;
      qc.invalidateQueries({ queryKey: ["assessments", a.branchId] });
      qc.invalidateQueries({ queryKey: assessmentKeys.detail(a.id) });
    },
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const useDeleteAssessment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAssessment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
};

// ─── Sections ─────────────────────────────────────────────────────────────────

export const sectionKeys = {
  list: (assessmentId: number) => ["sections", assessmentId] as const,
};

export const useGetSections = (assessmentId: number) => {
  return useQuery({
    queryKey: sectionKeys.list(assessmentId),
    queryFn: () => getSections(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSectionPayload) =>
      createSection(assessmentId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sectionKeys.list(assessmentId) });
    },
  });
};

export const useDeleteSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: number) => deleteSection(sectionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sectionKeys.list(assessmentId) });
    },
  });
};

export const useAddQuestionsToSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      questionIds,
    }: {
      sectionId: number;
      questionIds: number[];
    }) => addQuestionsToSection(sectionId, questionIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sectionKeys.list(assessmentId) });
    },
  });
};

export const useDeleteAssessmentQuestion = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (aqId: number) => deleteAssessmentQuestion(aqId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sectionKeys.list(assessmentId) });
    },
  });
};

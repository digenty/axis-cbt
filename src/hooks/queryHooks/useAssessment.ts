import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addQuestionsToSection,
<<<<<<< HEAD
  createAssessment,
  createSection,
  deleteAssessment,
  deleteAssessmentQuestion,
  deleteSection,
  getAssessment,
  getAssessments,
  getSections,
  publishAssessment,
=======
  addSection,
  createAssessment,
  deleteSection,
  getAssessment,
  getAssessmentResults,
  getAssessmentSections,
  getAssessmentStats,
  getAssessments,
  gradeManually,
  publishAssessment,
  removeQuestionFromSection,
>>>>>>> new-cbt
  updateAssessment,
} from "@/api/assessment";
import type {
  CreateAssessmentPayload,
  CreateSectionPayload,
<<<<<<< HEAD
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
=======
  GradeManuallyPayload,
  UpdateAssessmentPayload,
} from "@/types/question";

// ─── Query key factory ────────────────────────────────────────────────────────

export const assessmentKeys = {
  list: (classId: number, subjectId: number, branchId: number) =>
    ["assessments", classId, subjectId, branchId] as const,
  detail: (id: number) => ["assessments", id] as const,
  sections: (id: number) => ["assessments", id, "sections"] as const,
  results: (id: number) => ["assessments", id, "results"] as const,
  stats: (id: number) => ["assessments", id, "stats"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetAssessments = (payload: {
  branchId: number;
  classId: number;
  subjectId: number;
}) => {
  return useQuery({
    queryKey: assessmentKeys.list(
      payload.classId,
      payload.subjectId,
      payload.branchId,
    ),
    queryFn: () => getAssessments(payload),
    enabled: !!payload.branchId && !!payload.classId && !!payload.subjectId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAssessment = (assessmentId: number) => {
  return useQuery({
    queryKey: assessmentKeys.detail(assessmentId),
    queryFn: () => getAssessment(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAssessmentSections = (assessmentId: number) => {
  return useQuery({
    queryKey: assessmentKeys.sections(assessmentId),
    queryFn: () => getAssessmentSections(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetAssessmentResults = (assessmentId: number) => {
  return useQuery({
    queryKey: assessmentKeys.results(assessmentId),
    queryFn: () => getAssessmentResults(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetAssessmentStats = (assessmentId: number) => {
  return useQuery({
    queryKey: assessmentKeys.stats(assessmentId),
    queryFn: () => getAssessmentStats(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 2,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────
>>>>>>> new-cbt

export const useCreateAssessment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssessmentPayload) => createAssessment(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
<<<<<<< HEAD
        queryKey: ["assessments", vars.branchId],
=======
        queryKey: ["assessments", vars.classId, vars.subjectId],
>>>>>>> new-cbt
      });
    },
  });
};

<<<<<<< HEAD
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
=======
export const useUpdateAssessment = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAssessmentPayload) =>
      updateAssessment(assessmentId, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.detail(assessmentId),
      });
>>>>>>> new-cbt
    },
  });
};

<<<<<<< HEAD
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
=======
export const usePublishAssessment = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => publishAssessment(assessmentId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.detail(assessmentId),
      });
    },
  });
};

export const useAddSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSectionPayload) =>
      addSection(assessmentId, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.sections(assessmentId),
      });
>>>>>>> new-cbt
    },
  });
};

export const useDeleteSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
<<<<<<< HEAD
    mutationFn: (sectionId: number) => deleteSection(sectionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sectionKeys.list(assessmentId) });
=======
    mutationFn: (sectionId: number) => deleteSection(assessmentId, sectionId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.sections(assessmentId),
      });
>>>>>>> new-cbt
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
<<<<<<< HEAD
      qc.invalidateQueries({ queryKey: sectionKeys.list(assessmentId) });
=======
      qc.invalidateQueries({
        queryKey: assessmentKeys.sections(assessmentId),
      });
>>>>>>> new-cbt
    },
  });
};

<<<<<<< HEAD
export const useDeleteAssessmentQuestion = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (aqId: number) => deleteAssessmentQuestion(aqId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sectionKeys.list(assessmentId) });
=======
export const useRemoveQuestionFromSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assessmentQuestionId: number) =>
      removeQuestionFromSection(assessmentQuestionId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.sections(assessmentId),
      });
    },
  });
};

export const useGradeManually = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GradeManuallyPayload) => gradeManually(payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.results(assessmentId),
      });
>>>>>>> new-cbt
    },
  });
};

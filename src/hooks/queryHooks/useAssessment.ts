import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addQuestionsToSection,
  addSection,
  createAssessment,
  deleteAssessment,
  deleteSection,
  getAssessment,
  getAssessmentEnrollment,
  getAssessmentResults,
  getAssessmentSections,
  getAssessmentSettingsByClass,
  getAssessmentStats,
  getAssessments,
  getStudentAttemptAnswers,
  gradeManually,
  publishAssessment,
  removeQuestionFromSection,
  updateAssessment,
  updateSection,
} from "@/api/assessment";
import type {
  CreateAssessmentPayload,
  CreateSectionPayload,
  GradeManuallyPayload,
  UpdateAssessmentPayload,
  UpdateSectionPayload,
} from "@/types/question";

// ─── Query key factory ────────────────────────────────────────────────────────

export const assessmentKeys = {
  list: (classId: number, subjectId: number, branchId: number) =>
    ["assessments", classId, subjectId, branchId] as const,
  detail: (id: number) => ["assessments", id] as const,
  sections: (id: number) => ["assessments", id, "sections"] as const,
  results: (id: number) => ["assessments", id, "results"] as const,
  stats: (id: number) => ["assessments", id, "stats"] as const,
  enrollment: (id: number) => ["assessments", id, "enrollment"] as const,
  studentAttemptAnswers: (studentAssessmentId: number) =>
    [
      "assessments",
      "student-attempts",
      studentAssessmentId,
      "answers",
    ] as const,
  settingsByClass: (classId: number) =>
    ["assessment-settings", "class", classId] as const,
};

// ─── Assessment settings (school-level CA/Exam per class) ─────────────────────

export const useGetAssessmentSettingsByClass = (classId: number) => {
  return useQuery({
    queryKey: assessmentKeys.settingsByClass(classId),
    queryFn: () => getAssessmentSettingsByClass(classId),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetAssessments = (payload: {
  branchId: number;
  classId?: number;
  subjectId?: number;
}) => {
  return useQuery({
    queryKey: assessmentKeys.list(
      payload.classId ?? 0,
      payload.subjectId ?? 0,
      payload.branchId,
    ),
    queryFn: () => getAssessments(payload),
    enabled: !!payload.branchId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAssessmentEnrollment = (assessmentId: number) => {
  return useQuery({
    queryKey: assessmentKeys.enrollment(assessmentId),
    queryFn: () => getAssessmentEnrollment(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetStudentAttemptAnswers = (studentAssessmentId: number) => {
  return useQuery({
    queryKey: assessmentKeys.studentAttemptAnswers(studentAssessmentId),
    queryFn: () => getStudentAttemptAnswers(studentAssessmentId),
    enabled: !!studentAssessmentId,
    staleTime: 1000 * 30,
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

export const useCreateAssessment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssessmentPayload) => createAssessment(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["assessments", vars.classId, vars.subjectId],
      });
    },
  });
};

export const useUpdateAssessment = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAssessmentPayload) =>
      updateAssessment(assessmentId, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.detail(assessmentId),
      });
    },
  });
};

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
    },
  });
};

export const useDeleteSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: number) => deleteSection(assessmentId, sectionId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.sections(assessmentId),
      });
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
      qc.invalidateQueries({
        queryKey: assessmentKeys.sections(assessmentId),
      });
    },
  });
};

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

export const useGradeManually = (
  assessmentId: number,
  studentAssessmentId?: number,
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GradeManuallyPayload) => gradeManually(payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.results(assessmentId),
      });
      if (studentAssessmentId !== undefined) {
        qc.invalidateQueries({
          queryKey: assessmentKeys.studentAttemptAnswers(studentAssessmentId),
        });
      }
    },
  });
};

export const useDeleteAssessment = (
  classId: number,
  subjectId: number,
  branchId: number,
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: number) => deleteAssessment(assessmentId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.list(classId, subjectId, branchId),
      });
      // Broad invalidation so other branch/class scopes refresh too.
      qc.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
};

export const useUpdateSection = (assessmentId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: number;
      payload: UpdateSectionPayload;
    }) => updateSection(sectionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assessmentKeys.sections(assessmentId),
      });
      qc.invalidateQueries({
        queryKey: assessmentKeys.detail(assessmentId),
      });
    },
  });
};

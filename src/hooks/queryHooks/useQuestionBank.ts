import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCbtQuestionBankTopic,
  createCbtQuestion,
  deleteCbtQuestion,
  deleteCbtQuestionBankTopic,
  getCbtQuestion,
  getCbtQuestions,
  getCbtQuestionBankTopics,
  importCbtQuestions,
  updateCbtQuestion,
  updateCbtQuestionBankTopic,
} from "@/api/question";
import type {
  CbtQueBankTopicPayload,
  CreateQuestionPayload,
} from "@/types/question";

// ─── Query key factory ────────────────────────────────────────────────────────

export const questionBankKeys = {
  all: () => ["question-bank"] as const,

  topicsList: (classId: number, subjectId: number) =>
    ["question-bank", "topics", classId, subjectId] as const,

  questionsList: (classId: number, subjectId: number, topicId?: number) =>
    ["question-bank", "questions", classId, subjectId, topicId] as const,

  questionDetail: (id: number) => ["question-bank", "question", id] as const,
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const useGetTopics = (params: {
  classId: number;
  subjectId: number;
}) => {
  return useQuery({
    queryKey: questionBankKeys.topicsList(params.classId, params.subjectId),
    queryFn: () => getCbtQuestionBankTopics(params),
    enabled: !!params.classId && !!params.subjectId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddCbtTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CbtQueBankTopicPayload) =>
      addCbtQuestionBankTopic(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: questionBankKeys.topicsList(vars.classId, vars.subjectId),
      });
    },
  });
};

export const useUpdateCbtTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CbtQueBankTopicPayload>;
    }) => updateCbtQuestionBankTopic(id, payload),
    onSuccess: (_, vars) => {
      if (vars.payload.classId && vars.payload.subjectId) {
        qc.invalidateQueries({
          queryKey: questionBankKeys.topicsList(
            vars.payload.classId,
            vars.payload.subjectId,
          ),
        });
      }
    },
  });
};

export const useDeleteCbtTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCbtQuestionBankTopic(id),
    onSuccess: () => {
      // Invalidate all topic lists — we don't have classId/subjectId here
      qc.invalidateQueries({ queryKey: ["question-bank", "topics"] });
    },
  });
};

// ─── Questions ────────────────────────────────────────────────────────────────

export const useGetQuestions = (params: {
  classId: number;
  subjectId: number;
  topicId?: number;
}) => {
  return useQuery({
    queryKey: questionBankKeys.questionsList(
      params.classId,
      params.subjectId,
      params.topicId,
    ),
    queryFn: () => getCbtQuestions(params),
    enabled: !!params.classId && !!params.subjectId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetQuestion = (id: number) => {
  return useQuery({
    queryKey: questionBankKeys.questionDetail(id),
    queryFn: () => getCbtQuestion(id),
    enabled: !!id,
  });
};

export const useCreateCbtQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) => createCbtQuestion(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["question-bank", "questions", vars.classId, vars.subjectId],
      });
    },
  });
};

export const useUpdateCbtQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateQuestionPayload; // full payload required — API needs all fields
    }) => updateCbtQuestion(id, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: [
          "question-bank",
          "questions",
          vars.payload.classId,
          vars.payload.subjectId,
        ],
      });
      qc.invalidateQueries({
        queryKey: questionBankKeys.questionDetail(vars.id),
      });
    },
  });
};

export const useDeleteCbtQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCbtQuestion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-bank", "questions"] });
    },
  });
};

// ─── Import ───────────────────────────────────────────────────────────────────

export const useImportQuestions = (classId: number, subjectId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      importCbtQuestions({ classId, subjectId, file }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["question-bank", "questions", classId, subjectId],
      });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/Toast";
import {
  addCbtQuestionBankTopic,
  createCbtQuestion,
  deleteCbtQuestion,
  deleteCbtQuestionBankTopic,
  duplicateCbtQuestion,
  getCbtQuestion,
  getCbtQuestions,
  getCbtQuestionBankTopics,
  getQuestionBankStats,
  importCbtQuestions,
  previewCbtImport,
  updateCbtQuestion,
  updateCbtQuestionBankTopic,
} from "@/api/question";
import type {
  AiImportQuestion,
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

  stats: (classId: number, subjectId: number) =>
    ["question-bank", "stats", classId, subjectId] as const,
};

// ─── Error helper ─────────────────────────────────────────────────────────────

const errMsg = (e: unknown, fallback: string): string => {
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  return fallback;
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
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to add topic"), type: "error" }),
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
      } else {
        qc.invalidateQueries({ queryKey: ["question-bank", "topics"] });
      }
    },
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to update topic"), type: "error" }),
  });
};

export const useDeleteCbtTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCbtQuestionBankTopic(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-bank", "topics"] });
      qc.invalidateQueries({ queryKey: ["question-bank", "questions"] });
      qc.invalidateQueries({ queryKey: ["question-bank", "stats"] });
    },
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to delete topic"), type: "error" }),
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
      qc.invalidateQueries({
        queryKey: questionBankKeys.stats(vars.classId, vars.subjectId),
      });
    },
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to create question"), type: "error" }),
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
      payload: CreateQuestionPayload;
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
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to update question"), type: "error" }),
  });
};

export const useDuplicateCbtQuestion = (ctx?: {
  classId: number;
  subjectId: number;
}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => duplicateCbtQuestion(id),
    onSuccess: () => {
      if (ctx) {
        qc.invalidateQueries({
          queryKey: questionBankKeys.questionsList(ctx.classId, ctx.subjectId),
        });
        qc.invalidateQueries({
          queryKey: questionBankKeys.stats(ctx.classId, ctx.subjectId),
        });
      } else {
        qc.invalidateQueries({ queryKey: ["question-bank", "questions"] });
        qc.invalidateQueries({ queryKey: ["question-bank", "stats"] });
      }
    },
    onError: (e) =>
      toast({
        title: errMsg(e, "Failed to duplicate question"),
        type: "error",
      }),
  });
};

export const useDeleteCbtQuestion = (ctx?: {
  classId: number;
  subjectId: number;
}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCbtQuestion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-bank", "questions"] });
      if (ctx) {
        qc.invalidateQueries({
          queryKey: questionBankKeys.stats(ctx.classId, ctx.subjectId),
        });
      } else {
        qc.invalidateQueries({ queryKey: ["question-bank", "stats"] });
      }
    },
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to delete question"), type: "error" }),
  });
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const useGetQuestionBankStats = (classId: number, subjectId: number) => {
  return useQuery({
    queryKey: questionBankKeys.stats(classId, subjectId),
    queryFn: () => getQuestionBankStats({ classId, subjectId }),
    enabled: !!classId && !!subjectId,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Import ───────────────────────────────────────────────────────────────────

export const usePreviewImport = (classId: number, subjectId: number) => {
  return useMutation({
    mutationFn: (file: File) => previewCbtImport({ classId, subjectId, file }),
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to analyze file"), type: "error" }),
  });
};

export const useImportQuestions = (classId: number, subjectId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      questions: AiImportQuestion[];
      confirmNewTopics?: boolean;
    }) => importCbtQuestions({ classId, subjectId, ...payload }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: questionBankKeys.topicsList(classId, subjectId),
      });
      qc.invalidateQueries({
        queryKey: ["question-bank", "questions", classId, subjectId],
      });
      qc.invalidateQueries({
        queryKey: questionBankKeys.stats(classId, subjectId),
      });
    },
    onError: (e) =>
      toast({ title: errMsg(e, "Failed to import questions"), type: "error" }),
  });
};

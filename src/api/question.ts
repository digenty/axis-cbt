import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
  AiImportPayload,
  AiImportQuestion,
  AiImportResult,
  ApiQuestion,
  CbtQueBankTopicPayload,
  CreateQuestionPayload,
  ImportPreview,
  QuestionBankStatsResponse,
  QuestionResponse,
  TopicResponse,
  TopicsResponse,
} from "@/types/question";
import type {
  EditPreviewQuestionPayload,
  EditPreviewQuestionResponse,
} from "@/types/bulk-import";

// ─── Topics ───────────────────────────────────────────────────────────────────

export const getCbtQuestionBankTopics = async (payload: {
  classId: number;
  subjectId: number;
}): Promise<TopicsResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/question-bank/topics?classId=${payload?.classId}&subjectId=${payload?.subjectId}`,
    );

    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addCbtQuestionBankTopic = async (
  payload: CbtQueBankTopicPayload,
): Promise<TopicResponse> => {
  try {
    const { data } = await api.post("/api/cbt/question-bank/topics", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateCbtQuestionBankTopic = async (
  id: number,
  payload: Partial<CbtQueBankTopicPayload>,
): Promise<TopicResponse> => {
  try {
    const { data } = await api.put(
      `/api/cbt/question-bank/topics/${id}`,
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteCbtQuestionBankTopic = async (
  id: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(`/api/cbt/question-bank/topics/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Questions ────────────────────────────────────────────────────────────────

export const getCbtQuestions = async (payload: {
  classId: number;
  subjectId: number;
  topicId?: number;
}): Promise<ApiQuestion[]> => {
  try {
    const params = new URLSearchParams();
    if (payload?.topicId) params.set("topicId", String(payload?.topicId));
    const qs = params.toString();

    const { data } = await api.get(
      `/api/cbt/question-bank/questions/classes/${payload?.classId}/subjects/${payload?.subjectId}${qs ? `?${qs}` : ""}`,
    );

    return Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getCbtQuestion = async (id: number): Promise<QuestionResponse> => {
  try {
    const { data } = await api.get(`/api/cbt/question-bank/questions/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createCbtQuestion = async (
  payload: CreateQuestionPayload,
): Promise<QuestionResponse> => {
  try {
    const { data } = await api.post(
      "/api/cbt/question-bank/questions",
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateCbtQuestion = async (
  id: number,
  // Accepts the full payload — do NOT spread `id` into the body, the backend
  // reads it from the path param and the body `id` field confuses the deserialiser.
  payload: CreateQuestionPayload,
): Promise<QuestionResponse> => {
  try {
    const { data } = await api.put(
      `/api/cbt/question-bank/questions/${id}`,
      payload, // ← clean body, no extra `id` field
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteCbtQuestion = async (
  id: number,
): Promise<{ message: string; status: string }> => {
  try {
    const { data } = await api.delete(`/api/cbt/question-bank/questions/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const duplicateCbtQuestion = async (
  id: number,
): Promise<QuestionResponse> => {
  try {
    const { data } = await api.post(
      `/api/cbt/question-bank/questions/${id}/duplicate`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getQuestionBankStats = async (payload: {
  classId: number;
  subjectId: number;
}): Promise<QuestionBankStatsResponse> => {
  try {
    const { data } = await api.get(
      `/api/cbt/question-bank/stats?classId=${payload.classId}&subjectId=${payload.subjectId}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ─── Import ───────────────────────────────────────────────────────────────────

export const previewCbtImport = async (payload: {
  classId: number;
  subjectId: number;
  file: File;
}): Promise<{ data: ImportPreview; rawQuestions: AiImportQuestion[] }> => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const { data } = await api.post(
      `/api/cbt/question-bank/questions/ai-extract?classId=${payload.classId}&subjectId=${payload.subjectId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    // Transform the API response shape → ImportPreview
    const raw = data?.data ?? {};
    const rawQuestions: AiImportQuestion[] = raw.questions ?? [];

    const topicMap: Record<string, string> = {};
    for (const t of raw.autoAssignedTopics ?? []) {
      topicMap[t.section] = t.topicName;
    }

    const sectionOrder: string[] = [];
    const sectionBuckets: Record<string, AiImportQuestion[]> = {};
    for (const q of rawQuestions) {
      const sec = q.section ?? "General";
      if (!(sec in sectionBuckets)) {
        sectionOrder.push(sec);
        sectionBuckets[sec] = [];
      }
      sectionBuckets[sec].push(q);
    }

    let n = 1;
    const sections = sectionOrder.map((name) => ({
      name,
      topicTag: topicMap[name] ?? name,
      questions: sectionBuckets[name].map((q) => ({
        id: `q-${n}`,
        number: n++,
        type: q.questionType,
        status: (q.needsReview ? "needs_review" : "valid") as
          | "valid"
          | "needs_review",
        text: q.questionText,
        options: q.options?.map((o) => ({ label: o.label, text: o.text })),
        correctAnswer: q.options?.find((o) => o.isCorrect)?.label,
      })),
    }));

    return {
      data: {
        fileName: raw.sourceFilename ?? "",
        curriculum: raw.curriculum,
        totalQuestions: raw.totalQuestions ?? rawQuestions.length,
        sections,
      },
      rawQuestions,
    };
  } catch (error) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const importCbtQuestions = async (
  payload: AiImportPayload,
): Promise<{ data: AiImportResult; message: string }> => {
  try {
    const { data } = await api.post(
      `/api/cbt/question-bank/questions/ai-import`,
      payload,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const editPreviewQuestion = async ({
  questionId,
  payload,
}: {
  questionId: string;
  payload: EditPreviewQuestionPayload;
}): Promise<EditPreviewQuestionResponse> => {
  try {
    const { data } = await api.patch(
      `/api/cbt/question-bank/questions/import/preview/${questionId}`,
      payload,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

import {
	addCbtQuestionBankTopic,
	createCbtQuestion,
	deleteCbtQuestion,
	deleteCbtQuestionBankTopic,
	getCbtQuestionBankTopics,
	getCbtQuestions,
	updateCbtQuestion,
	updateCbtQuestionBankTopic,
} from "@/api/question";
import {
	CbtQueBankTopicPayload,
	CreateQuestionPayload,
} from "@/types/question";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const questionBankKeys = {
	all: ["question-bank"] as const,
	topics: (classId?: number, subjectId?: number) =>
		[...questionBankKeys.all, "topics", classId, subjectId] as const,
	questions: (classId?: number, subjectId?: number, topicId?: number) =>
		[
			...questionBankKeys.all,
			"questions",
			classId,
			subjectId,
			topicId,
		] as const,
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const useGetCbtTopics = (payload: {
	classId?: number;
	subjectId?: number;
}) => {
	return useQuery({
		queryKey: questionBankKeys.topics(payload.classId, payload.subjectId),
		queryFn: () => getCbtQuestionBankTopics(payload),
		enabled: !!payload.classId && !!payload.subjectId,
		staleTime: 1000 * 60 * 5,
	});
};

export const useAddCbtTopic = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addCbtQuestionBankTopic,
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: questionBankKeys.topics(
					variables.classId,
					variables.subjectId,
				),
			});
		},
	});
};

export const useUpdateCbtTopic = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: number;
			payload: Partial<CbtQueBankTopicPayload>;
		}) => updateCbtQuestionBankTopic(id, { ...payload, id }),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: questionBankKeys.topics(
					variables.payload.classId,
					variables.payload.subjectId,
				),
			});
		},
	});
};

export const useDeleteCbtTopic = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteCbtQuestionBankTopic(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: questionBankKeys.all });
		},
	});
};

// ─── Questions ────────────────────────────────────────────────────────────────

export const useGetCbtQuestions = (payload: {
	classId?: number;
	subjectId?: number;
	topicId?: number;
}) => {
	return useQuery({
		queryKey: questionBankKeys.questions(
			payload.classId,
			payload.subjectId,
			payload.topicId,
		),
		queryFn: () =>
			getCbtQuestions({
				classId: payload.classId!,
				subjectId: payload.subjectId!,
				topicId: payload.topicId,
			}),
		enabled: !!payload.classId && !!payload.subjectId && !!payload.topicId,
		staleTime: 1000 * 60 * 5,
	});
};

export const useCreateCbtQuestion = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateQuestionPayload) =>
			createCbtQuestion(payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: questionBankKeys.questions(
					variables.classId,
					variables.subjectId,
					variables.topicId,
				),
			});
		},
	});
};

export const useUpdateCbtQuestion = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: number;
			payload: Partial<CreateQuestionPayload>;
		}) => updateCbtQuestion(id, payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: questionBankKeys.questions(
					variables.payload.classId,
					variables.payload.subjectId,
					variables.payload.topicId,
				),
			});
		},
	});
};

export const useDeleteCbtQuestion = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteCbtQuestion(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: questionBankKeys.all });
		},
	});
};

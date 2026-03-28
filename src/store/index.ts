import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Class, Subject, Topic, Question, Test } from "@/types";
import {
	mockClasses,
	mockSubjects,
	mockTopics,
	mockQuestions,
} from "@/lib/mock-data";

interface CBTStore {
	classes: Class[];
	subjects: Subject[];
	topics: Topic[];
	questions: Question[];
	tests: Test[];
	isLoading: boolean;

	addTopic: (topic: Topic) => void;
	updateTopic: (id: string, name: string) => void;
	deleteTopic: (id: string) => void;
	reorderTopics: (subjectId: string, orderedIds: string[]) => void;

	addQuestion: (question: Question) => void;
	updateQuestion: (id: string, question: Partial<Question>) => void;
	deleteQuestion: (id: string) => void;
	duplicateQuestion: (id: string) => void;
	reorderQuestions: (topicId: string, orderedIds: string[]) => void;

	addTest: (test: Test) => void;
	updateTest: (id: string, data: Partial<Test>) => void;
	deleteTest: (id: string) => void;
	getTestsBySubject: (subjectId: string) => Test[];

	getSubjectsByClass: (classId: string) => Subject[];
	getTopicsBySubject: (subjectId: string) => Topic[];
	getQuestionsByTopic: (topicId: string) => Question[];
	setLoading: (val: boolean) => void;
	addClass: (cls: Class) => void;
	addSubject: (subject: Subject) => void;
}

export const useCBTStore = create<CBTStore>()(
	persist(
		(set, get) => ({
			classes: mockClasses,
			subjects: mockSubjects,
			topics: mockTopics,
			questions: mockQuestions,
			tests: [],
			isLoading: false,

			setLoading: (val) => set({ isLoading: val }),
			addClass: (cls) => set((s) => ({ classes: [...s.classes, cls] })),
			addSubject: (subject) =>
				set((s) => ({ subjects: [...s.subjects, subject] })),

			addTopic: (topic) => set((s) => ({ topics: [...s.topics, topic] })),
			updateTopic: (id, name) =>
				set((s) => ({
					topics: s.topics.map((t) => (t.id === id ? { ...t, name } : t)),
				})),
			deleteTopic: (id) =>
				set((s) => ({
					topics: s.topics.filter((t) => t.id !== id),
					questions: s.questions.filter((q) => q.topicId !== id),
				})),
			reorderTopics: (subjectId, orderedIds) =>
				set((s) => {
					const subjectTopics = s.topics.filter(
						(t) => t.subjectId === subjectId,
					);
					const otherTopics = s.topics.filter(
						(t) => t.subjectId !== subjectId,
					);
					const reordered = orderedIds
						.map((id) => subjectTopics.find((t) => t.id === id))
						.filter(Boolean) as Topic[];
					return { topics: [...otherTopics, ...reordered] };
				}),

			addQuestion: (question) =>
				set((s) => ({ questions: [...s.questions, question] })),
			updateQuestion: (id, data) =>
				set((s) => ({
					questions: s.questions.map((q) =>
						q.id === id
							? { ...q, ...data, updatedAt: new Date().toISOString() }
							: q,
					),
				})),
			deleteQuestion: (id) =>
				set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),
			duplicateQuestion: (id) => {
				const q = get().questions.find((q) => q.id === id);
				if (!q) return;
				const newId =
					Math.random().toString(36).substr(2, 9) +
					Date.now().toString(36);
				const copy: Question = {
					...q,
					id: newId,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				set((s) => {
					const idx = s.questions.findIndex((q) => q.id === id);
					const next = [...s.questions];
					next.splice(idx + 1, 0, copy);
					return { questions: next };
				});
			},
			reorderQuestions: (topicId, orderedIds) =>
				set((s) => {
					const topicQs = s.questions.filter((q) => q.topicId === topicId);
					const otherQs = s.questions.filter((q) => q.topicId !== topicId);
					const reordered = orderedIds
						.map((id) => topicQs.find((q) => q.id === id))
						.filter(Boolean) as Question[];
					return { questions: [...otherQs, ...reordered] };
				}),

			addTest: (test) => set((s) => ({ tests: [...s.tests, test] })),
			updateTest: (id, data) =>
				set((s) => ({
					tests: s.tests.map((t) =>
						t.id === id
							? { ...t, ...data, updatedAt: new Date().toISOString() }
							: t,
					),
				})),
			deleteTest: (id) =>
				set((s) => ({ tests: s.tests.filter((t) => t.id !== id) })),
			getTestsBySubject: (subjectId) =>
				get().tests.filter((t) => t.subjectId === subjectId),

			getSubjectsByClass: (classId) =>
				get().subjects.filter((s) => s.classId === classId),
			getTopicsBySubject: (subjectId) =>
				get().topics.filter((t) => t.subjectId === subjectId),
			getQuestionsByTopic: (topicId) =>
				get().questions.filter((q) => q.topicId === topicId),
		}),
		{ name: "cbt-store" },
	),
);

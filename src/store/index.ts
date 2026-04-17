import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	Class,
	Subject,
	Topic,
	Question,
	Test,
	StudentAttempt,
	StudentAnswer,
} from "@/types";
import {
	mockClasses,
	mockSubjects,
	mockTopics,
	mockQuestions,
	mockAttempts,
} from "@/lib/mock-data";

interface CBTStore {
	classes: Class[];
	subjects: Subject[];
	topics: Topic[];
	questions: Question[];
	tests: Test[];
	attempts: StudentAttempt[];
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

	getAttemptsByTest: (testId: string) => StudentAttempt[];
	updateAttempt: (id: string, data: Partial<StudentAttempt>) => void;
	gradeAttempt: (
		id: string,
		score: number,
		feedback: string,
		answers: StudentAnswer[],
	) => void;

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
			attempts: mockAttempts,
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
					const sub = s.topics.filter((t) => t.subjectId === subjectId);
					const rest = s.topics.filter((t) => t.subjectId !== subjectId);
					const reordered = orderedIds
						.map((id) => sub.find((t) => t.id === id))
						.filter(Boolean) as Topic[];
					return { topics: [...rest, ...reordered] };
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
					const tqs = s.questions.filter((q) => q.topicId === topicId);
					const rest = s.questions.filter((q) => q.topicId !== topicId);
					const reordered = orderedIds
						.map((id) => tqs.find((q) => q.id === id))
						.filter(Boolean) as Question[];
					return { questions: [...rest, ...reordered] };
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
				get().tests.filter((t) => String(t.subjectId) === subjectId),

			getAttemptsByTest: (testId) =>
				get().attempts.filter((a) => a.testId === testId),
			updateAttempt: (id, data) =>
				set((s) => ({
					attempts: s.attempts.map((a) =>
						a.id === id ? { ...a, ...data } : a,
					),
				})),
			gradeAttempt: (id, score, feedback, answers) =>
				set((s) => {
					const attempt = s.attempts.find((a) => a.id === id);
					if (!attempt) return s;
					const totalMarks = attempt.totalMarks || 100;
					const percentage = Math.round((score / totalMarks) * 1000) / 10;
					const weightedScore =
						Math.round((percentage / 100) * 20 * 10) / 10; // example 20% weight
					return {
						attempts: s.attempts.map((a) =>
							a.id === id
								? {
										...a,
										status: "graded" as const,
										score,
										totalMarks,
										percentage,
										weightedScore,
										feedback,
										answers,
										gradedAt: new Date().toISOString(),
									}
								: a,
						),
					};
				}),

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

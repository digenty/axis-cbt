"use client";

import { useState, useEffect } from "react";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "./ui";
import { QuestionBankSidebar } from "./QuestionBankSidebar";
import { AddQuestionForm } from "./AddQuestionForm";
import { QuestionGroupForm } from "./QuestionGroupForm";
import { MultipleBlanksForm } from "./MultipleBlanksForm";
import { QuestionListView } from "./QuestionListView";
import { AddAssessmentItemModal } from "./AddAssessmentItemModal";
import { NormalizedQuestion, QuestionType } from "@/types/question.types";
import { useGetCbtTopics } from "@/hooks/queryHooks/useQuestionBank";
import { ApiTopic } from "@/types/question";
import { ImportQuestionsModal } from "./ImportQuestionModal";

// ─── Form mode discriminated union ───────────────────────────────────────────

type FormMode =
	| { kind: "none" }
	| { kind: "single"; type: QuestionType; question?: NormalizedQuestion }
	| { kind: "group"; question?: NormalizedQuestion }
	| { kind: "blanks"; question?: NormalizedQuestion };

interface QuestionBankViewProps {
	classId: number;
	subjectId: number;
}

export const QuestionBankView = ({
	classId,
	subjectId,
}: QuestionBankViewProps) => {
	const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
	const [formMode, setFormMode] = useState<FormMode>({ kind: "none" });
	const [addItemModalOpen, setAddItemModalOpen] = useState(false);
	const [importModalOpen, setImportModalOpen] = useState(false);

	const { data: topicsResponse, isLoading: topicsLoading } = useGetCbtTopics({
		classId,
		subjectId,
	});

	const topics: ApiTopic[] = topicsResponse?.data ?? [];

	// Auto-select first topic once loaded
	useEffect(() => {
		if (topics.length > 0 && !selectedTopicId) {
			setSelectedTopicId(topics[0].id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [topics.length]);

	const selectedTopic = topics.find((t) => t.id === selectedTopicId);

	const closeForm = () => setFormMode({ kind: "none" });

	const handleAddQuestion = () => {
		if (!selectedTopicId) return;
		setAddItemModalOpen(true);
	};

	const handleEditQuestion = (question: NormalizedQuestion) => {
		if (question.questionType === "question-group") {
			setFormMode({ kind: "group", question });
		} else if (question.questionType === "multiple-blanks") {
			setFormMode({ kind: "blanks", question });
		} else {
			setFormMode({ kind: "single", type: question.questionType, question });
		}
	};

	const renderContent = () => {
		if (formMode.kind === "single") {
			return (
				<AddQuestionForm
					classId={classId}
					subjectId={subjectId}
					topicId={selectedTopicId!}
					editQuestion={formMode.question}
					onClose={closeForm}
					onSaved={closeForm}
				/>
			);
		}

		if (formMode.kind === "group") {
			return (
				<QuestionGroupForm
					classId={classId}
					subjectId={subjectId}
					topicId={selectedTopicId!}
					editQuestion={formMode.question}
					onClose={closeForm}
					onSaved={closeForm}
				/>
			);
		}

		if (formMode.kind === "blanks") {
			return (
				<MultipleBlanksForm
					classId={classId}
					subjectId={subjectId}
					topicId={selectedTopicId!}
					editQuestion={formMode.question}
					onClose={closeForm}
					onSaved={closeForm}
				/>
			);
		}

		if (selectedTopic) {
			return (
				<QuestionListView
					classId={classId}
					subjectId={subjectId}
					topicId={selectedTopic.id}
					topicName={selectedTopic.name}
					onAddQuestion={handleAddQuestion}
					onEditQuestion={handleEditQuestion}
				/>
			);
		}

		return (
			<EmptyState
				icon={<FolderOpen className="h-12 w-12" />}
				title="No topics yet"
				description="Add topics from the sidebar to start building your question bank"
			/>
		);
	};

	return (
		<>
			<div className="flex h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				{/* Sidebar */}
				<QuestionBankSidebar
					topics={topics}
					classId={classId}
					subjectId={subjectId}
					selectedTopicId={selectedTopicId}
					isLoading={topicsLoading}
					onSelectTopic={(id) => {
						setSelectedTopicId(id);
						setFormMode({ kind: "none" });
					}}
					onImportQuestions={() => setImportModalOpen(true)}
				/>

				{/* Main content */}
				<div className="flex flex-1 overflow-hidden">{renderContent()}</div>
			</div>

			{/* Add question type picker */}
			<AddAssessmentItemModal
				open={addItemModalOpen}
				onClose={() => setAddItemModalOpen(false)}
				onSelectType={(type) => {
					setAddItemModalOpen(false);
					setFormMode({ kind: "single", type });
				}}
				onSelectGroup={() => {
					setAddItemModalOpen(false);
					setFormMode({ kind: "group" });
				}}
				onSelectMultipleBlanks={() => {
					setAddItemModalOpen(false);
					setFormMode({ kind: "blanks" });
				}}
				onSelectMatch={() => {
					setAddItemModalOpen(false);
					setFormMode({ kind: "single", type: "matching" });
				}}
			/>

			{/* Import modal */}
			<ImportQuestionsModal
				open={importModalOpen}
				onClose={() => setImportModalOpen(false)}
				onImported={(count) => {
					setImportModalOpen(false);
					console.log(`Imported ${count} questions`);
				}}
			/>
		</>
	);
};

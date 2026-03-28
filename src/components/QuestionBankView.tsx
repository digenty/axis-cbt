"use client";

import { useState, useEffect } from "react";
import { useCBTStore } from "@/store";
import { Question, QuestionType } from "@/types";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "./ui";
import { QuestionBankSidebar } from "./QuestionBankSidebar";
import { AddQuestionForm } from "./AddQuestionForm";
import { QuestionGroupForm } from "./QuestionGroupForm";
import { MultipleBlanksForm } from "./MultipleBanksForm";
import { QuestionListView } from "./QuestionListView";
import { AddAssessmentItemModal } from "./AddAssessmentItemModal";
import { ImportQuestionsModal } from "./ImportQuestionModal";

type FormMode =
	| { kind: "none" }
	| { kind: "single"; type: QuestionType; question?: Question }
	| { kind: "group"; question?: Question }
	| { kind: "blanks"; question?: Question }
	| { kind: "match"; question?: Question };

interface QuestionBankViewProps {
	subjectId: string;
}

export const QuestionBankView = ({ subjectId }: QuestionBankViewProps) => {
	const { getTopicsBySubject } = useCBTStore();
	const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
	const [formMode, setFormMode] = useState<FormMode>({ kind: "none" });
	const [addItemModalOpen, setAddItemModalOpen] = useState(false);
	const [importModalOpen, setImportModalOpen] = useState(false);

	const topics = getTopicsBySubject(subjectId);

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

	const handleEditQuestion = (question: Question) => {
		if (question.type === "question-group") {
			setFormMode({ kind: "group", question });
		} else if (question.type === "multiple-blanks") {
			setFormMode({ kind: "blanks", question });
		} else {
			setFormMode({ kind: "single", type: question.type, question });
		}
	};

	const showForm = formMode.kind !== "none";

	const FORM_COMPONENTS = {
		single: AddQuestionForm,
		group: QuestionGroupForm,
		blanks: MultipleBlanksForm,
	} as const;

	type FormKind = keyof typeof FORM_COMPONENTS; // "single" | "group" | "blanks"

	const isRenderableForm = (
		mode: FormMode,
	): mode is Extract<FormMode, { kind: FormKind }> => {
		return mode.kind in FORM_COMPONENTS;
	};

	const renderContent = () => {
		if (showForm && isRenderableForm(formMode)) {
			const Form = FORM_COMPONENTS[formMode.kind];
			return (
				<Form
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
				title="No topics"
				description="Add topics to group your questions"
			/>
		);
	};

	return (
		<>
			<div className="flex h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				{/* Sidebar — always visible */}
				<QuestionBankSidebar
					subjectId={subjectId}
					selectedTopicId={selectedTopicId}
					onSelectTopic={(id) => {
						setSelectedTopicId(id);
						setFormMode({ kind: "none" });
					}}
					onImportQuestions={() => setImportModalOpen(true)}
				/>

				{/* Main content */}
				<div className="flex flex-1 overflow-hidden">{renderContent()}</div>
			</div>

			{/* Add Assessment Item Modal */}
			<AddAssessmentItemModal
				open={addItemModalOpen}
				onClose={() => setAddItemModalOpen(false)}
				onSelectType={(type) => {
					setAddItemModalOpen(false);
					setFormMode({ kind: "single", type });
				}}
				onSelectGroup={() => setFormMode({ kind: "group" })}
				onSelectMultipleBlanks={() => setFormMode({ kind: "blanks" })}
				onSelectMatch={() => {
					setFormMode({ kind: "single", type: "matching" });
				}}
			/>

			<ImportQuestionsModal
				open={importModalOpen}
				onClose={() => setImportModalOpen(false)}
				onImported={(count) => {
					setImportModalOpen(false);
					// actually add the questions
					console.log({ ImportQuestionsModalCount: count });
				}}
			/>
		</>
	);
};

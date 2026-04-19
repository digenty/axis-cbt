"use client";

import React, { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/ui";
import { QuestionBankSidebar } from "./QuestionBankSidebar";
import { AddQuestionForm } from "./AddQuestionForm";
import { FillInBlanksForm } from "./FillInBlanksForm";
import { QuestionGroupForm } from "./QuestionGroupForm";
import { QuestionListView } from "./QuestionListView";
import { AddAssessmentItemModal } from "@/components/assessments/AddAssessmentItemModal";
import { useGetTopics } from "@/hooks/queryHooks/useQuestionBank";
import type { ApiQuestion, ApiTopic, QuestionType } from "@/types/question";
import { ImportQuestionsModal } from "./ImportQuestionModal";

// ─── Form mode ────────────────────────────────────────────────────────────────

type FormMode =
  | { kind: "none" }
  | { kind: "single"; questionType: QuestionType; question?: ApiQuestion }
  | { kind: "blanks"; question?: ApiQuestion }
  | {
      kind: "group";
      // Carries whether this was opened as COMPREHENSION or QUESTION_GROUP
      initialQuestionType?: "QUESTION_GROUP" | "COMPREHENSION";
      question?: ApiQuestion;
    };

// ─── Props ────────────────────────────────────────────────────────────────────

interface QuestionBankViewProps {
  classId: number;
  subjectId: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QuestionBankView = ({
  classId,
  subjectId,
}: QuestionBankViewProps) => {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<FormMode>({ kind: "none" });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const { data: topicsResponse, isLoading: topicsLoading } = useGetTopics({
    classId,
    subjectId,
  });
  const topics: ApiTopic[] = topicsResponse?.data ?? [];

  // Auto-select first topic on load
  useEffect(() => {
    if (topics?.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics?.length]);

  const selectedTopic = topics?.find((t) => t.id === selectedTopicId);
  const closeForm = () => setFormMode({ kind: "none" });

  const handleAddQuestion = () => {
    if (!selectedTopicId) return;
    setAddModalOpen(true);
  };

  // Called when user picks a type from the modal
  const handleSelectType = (type: QuestionType) => {
    setAddModalOpen(false);
    if (type === "QUESTION_GROUP") {
      setFormMode({ kind: "group", initialQuestionType: "QUESTION_GROUP" });
    } else if (type === "COMPREHENSION") {
      setFormMode({ kind: "group", initialQuestionType: "COMPREHENSION" });
    } else if (type === "FILL_IN_THE_BLANK") {
      setFormMode({ kind: "blanks" });
    } else {
      setFormMode({ kind: "single", questionType: type });
    }
  };

  // Called when user clicks Edit on a question card
  const handleEditQuestion = (question: ApiQuestion) => {
    const type = question?.questionType as QuestionType;
    if (type === "QUESTION_GROUP") {
      setFormMode({
        kind: "group",
        initialQuestionType: "QUESTION_GROUP",
        question,
      });
    } else if (type === "COMPREHENSION") {
      setFormMode({
        kind: "group",
        initialQuestionType: "COMPREHENSION",
        question,
      });
    } else if (type === "FILL_IN_THE_BLANK") {
      setFormMode({ kind: "blanks", question });
    } else {
      setFormMode({ kind: "single", questionType: type, question });
    }
  };

  // ── Render content area ──────────────────────────────────────────────────

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

    if (formMode.kind === "blanks") {
      return (
        <FillInBlanksForm
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
          initialQuestionType={formMode.initialQuestionType}
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
        description="Create a topic in the sidebar to start adding questions"
      />
    );
  };

  return (
    <>
      <div className="flex h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <QuestionBankSidebar
          topics={topics}
          classId={classId}
          subjectId={subjectId}
          selectedTopicId={selectedTopicId}
          isLoading={topicsLoading}
          onSelectTopic={(id) => {
            setSelectedTopicId(id);
            closeForm();
          }}
          onImportQuestions={() => setImportModalOpen(true)}
        />
        <div className="flex flex-1 overflow-hidden">{renderContent()}</div>
      </div>

      <AddAssessmentItemModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSelectType={handleSelectType}
      />

      <ImportQuestionsModal
        open={importModalOpen}
        classId={classId}
        subjectId={subjectId}
        onClose={() => setImportModalOpen(false)}
        onImported={() => setImportModalOpen(false)}
      />
    </>
  );
};

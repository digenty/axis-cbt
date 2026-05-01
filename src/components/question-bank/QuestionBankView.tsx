"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Plus } from "lucide-react";
import { useCBTStore } from "@/store";
import { generateId } from "@/lib/utils";
import { QuestionBankSidebar } from "./QuestionBankSidebar";
import { QuestionListPanel } from "./QuestionListPanel";
import { TopicFormDialog } from "./TopicFormDialog";
import { DeleteTopicDialog } from "./DeleteTopicDialog";
import { AddAssessmentItemModal } from "./AddAssessmentItemModal";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import type { MaterialKind } from "./answer-editors/QuestionGroupEditor";
import type { Question, Topic, QuestionType } from "@/types";
import { toast } from "sonner";

interface QuestionBankViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const QuestionBankView = ({ params }: QuestionBankViewProps) => {
  const { classId, subjectId } = use(params);
  const router = useRouter();
  const {
    classes,
    subjects,
    topics,
    questions,
    addTopic,
    addQuestion,
    updateQuestion,
    updateTopic,
    deleteTopic,
    reorderTopics,
    duplicateQuestion,
    deleteQuestion,
    reorderQuestions,
  } = useCBTStore();

  const cls = useMemo(
    () => classes.find((c) => c.id === classId),
    [classes, classId],
  );
  const subject = useMemo(
    () => subjects.find((s) => s.id === subjectId),
    [subjects, subjectId],
  );

  const subjectTopics = useMemo(
    () => topics.filter((t) => String(t.subjectId) === String(subjectId)),
    [topics, subjectId],
  );

  const [activeTopicId, setActiveTopicId] = useState<string | null>(
    subjectTopics[0]?.id ?? null,
  );
  const [addTopicOpen, setAddTopicOpen] = useState(false);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType | null>(
    null,
  );
  const [newMaterialKind, setNewMaterialKind] = useState<MaterialKind | null>(
    null,
  );
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);

  const resolvedActiveId =
    activeTopicId && subjectTopics.some((t) => t.id === activeTopicId)
      ? activeTopicId
      : (subjectTopics[0]?.id ?? null);

  const activeTopic =
    subjectTopics.find((t) => t.id === resolvedActiveId) ?? null;

  const topicQuestions = useMemo(
    () =>
      activeTopic
        ? questions.filter((q) => String(q.topicId) === String(activeTopic.id))
        : [],
    [questions, activeTopic],
  );

  if (!cls || !subject) {
    return (
      <div className="px-6 py-6">
        <EmptyState title="Subject not found" />
      </div>
    );
  }

  const subjectTitle = "Question Bank";
  const subtitle = `${cls.name.replace(" ", "")} - ${subject.name}`;
  const baseUrl = `/classes/${cls.id}/subjects/${subject.id}`;

  const handleAddTopic = (name: string) => {
    const newTopic: Topic = {
      id: generateId(),
      name,
      subjectId: subject.id as unknown as Topic["subjectId"],
      questions: [],
      createdAt: new Date().toISOString(),
    };
    addTopic(newTopic);
    setActiveTopicId(newTopic.id);
    toast.success("Topic added");
  };

  const handleDeleteTopic = (id: string) => {
    deleteTopic(id);
    toast.success("Topic deleted");
  };

  const handleReorderTopics = (orderedIds: string[]) => {
    reorderTopics(subject.id as unknown as number, orderedIds);
  };

  const handleAddQuestion = () => {
    if (!activeTopic) {
      toast.error("Add a topic first");
      return;
    }
    setAddQuestionOpen(true);
  };

  const handleSelectQuestionType = (
    type: QuestionType,
    materialKind?: string,
  ) => {
    setNewQuestionType(type);
    setNewMaterialKind((materialKind as MaterialKind) ?? null);
  };

  const handleSaveNewQuestion = (q: Question) => {
    addQuestion(q);
    toast.success("Question created");
    setNewQuestionType(null);
    setNewMaterialKind(null);
  };

  const handleSelectTopic = (id: string) => {
    setNewQuestionType(null);
    setNewMaterialKind(null);
    setActiveTopicId(id);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      <QuestionBankSidebar
        subjectTitle={subjectTitle}
        subtitle={subtitle}
        topics={subjectTopics}
        activeTopicId={resolvedActiveId}
        onSelectTopic={handleSelectTopic}
        onRequestAddTopic={() => setAddTopicOpen(true)}
        onRequestRenameTopic={setEditingTopic}
        onRequestDeleteTopic={setDeletingTopic}
        onReorderTopics={handleReorderTopics}
        importHref={`${baseUrl}/question-bank/import`}
        backHref={baseUrl}
      />

      {subjectTopics.length === 0 ? (
        <section className="flex flex-1 items-center justify-center bg-[var(--color-bg-default)] px-6">
          <EmptyState
            icon={<FolderOpen className="h-8 w-8" />}
            title="No topics"
            description="Add topics to group your questions"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddTopicOpen(true)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Topic
              </Button>
            }
          />
        </section>
      ) : (
        <QuestionListPanel
          topic={activeTopic}
          questions={topicQuestions}
          onAddQuestion={handleAddQuestion}
          onEditQuestion={(id) => router.push(`${baseUrl}/question-bank/${id}`)}
          onDuplicate={(id) => {
            duplicateQuestion(id);
            toast.success("Question duplicated");
          }}
          onDelete={(id) => {
            deleteQuestion(id);
            toast.success("Question deleted");
          }}
          onReorder={(orderedIds) => {
            if (activeTopic) reorderQuestions(activeTopic.id, orderedIds);
          }}
          newQuestionType={newQuestionType}
          newMaterialKind={newMaterialKind}
          onSaveNew={handleSaveNewQuestion}
          onCancelNew={() => {
            setNewQuestionType(null);
            setNewMaterialKind(null);
          }}
          onUpdateQuestion={(q) => updateQuestion(q.id, q)}
        />
      )}

      <AddAssessmentItemModal
        open={addQuestionOpen}
        setOpen={setAddQuestionOpen}
        onSelectType={handleSelectQuestionType}
      />

      <TopicFormDialog
        open={addTopicOpen}
        setOpen={setAddTopicOpen}
        mode="add"
        onSubmit={handleAddTopic}
      />

      <TopicFormDialog
        key={`edit-${editingTopic?.id ?? "none"}`}
        open={editingTopic !== null}
        setOpen={(o) => {
          if (!o) setEditingTopic(null);
        }}
        mode="edit"
        initialName={editingTopic?.name}
        onSubmit={(name) => {
          if (editingTopic) {
            updateTopic(editingTopic.id, name);
            toast.success("Topic updated");
          }
          setEditingTopic(null);
        }}
      />

      <DeleteTopicDialog
        key={`delete-${deletingTopic?.id ?? "none"}`}
        open={deletingTopic !== null}
        setOpen={(o) => {
          if (!o) setDeletingTopic(null);
        }}
        onConfirm={() => {
          if (deletingTopic) {
            handleDeleteTopic(deletingTopic.id);
          }
          setDeletingTopic(null);
        }}
      />
    </div>
  );
};

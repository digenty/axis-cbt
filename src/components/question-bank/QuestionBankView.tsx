"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Plus, Loader2 } from "lucide-react";
import { QuestionBankSidebar } from "./QuestionBankSidebar";
import { QuestionListPanel } from "./QuestionListPanel";
import { TopicFormDialog } from "./TopicFormDialog";
import { DeleteTopicDialog } from "./DeleteTopicDialog";
import { AddAssessmentItemModal } from "./AddAssessmentItemModal";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import type { MaterialKind } from "./answer-editors/QuestionGroupEditor";
import type { Question, Topic, QuestionType } from "@/types";
import type { ApiTopic } from "@/types/question";
import { toast } from "sonner";
import {
  useAddCbtTopic,
  useCreateCbtQuestion,
  useDeleteCbtQuestion,
  useDeleteCbtTopic,
  useGetQuestions,
  useGetQuestionBankStats,
  useGetTopics,
  useUpdateCbtQuestion,
  useUpdateCbtTopic,
} from "@/hooks/queryHooks/useQuestionBank";
import {
  useGetClassDetails,
  useGetSubjectsByClassId,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import {
  apiQuestionToUI,
  questionToCreatePayload,
} from "@/types/question.mapper";

interface QuestionBankViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

interface TopicFormDraft {
  name: string;
  description: string;
}

const apiTopicToUI = (t: ApiTopic): Topic => ({
  id: String(t.id),
  name: t.name,
  subjectId: t.subjectId,
  questions: [],
  createdAt: "",
});

export const QuestionBankView = ({ params }: QuestionBankViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const router = useRouter();
  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;

  // ─── Server data ──────────────────────────────────────────────────────────
  const { data: classDetails } = useGetClassDetails(classId);
  const { data: teacherSubjects } = useGetTeacherSubjects();
  const { data: classSubjects } = useGetSubjectsByClassId(classId);
  const {
    data: topicsRes,
    isLoading: topicsLoading,
    isError: topicsError,
  } = useGetTopics({ classId, subjectId });

  const apiTopics = useMemo(() => topicsRes?.data ?? [], [topicsRes]);
  const subjectTopics = useMemo(() => apiTopics.map(apiTopicToUI), [apiTopics]);

  // ─── Active topic (derived: user selection falls back to first topic) ─────
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const activeTopicId =
    selectedTopicId && subjectTopics.some((t) => t.id === selectedTopicId)
      ? selectedTopicId
      : (subjectTopics[0]?.id ?? null);

  const activeTopic = subjectTopics.find((t) => t.id === activeTopicId) ?? null;
  const activeTopicNumId = activeTopic ? Number(activeTopic.id) : null;

  // ─── Questions for the active topic ───────────────────────────────────────
  const { data: questionsRes, isLoading: questionsLoading } = useGetQuestions({
    classId,
    subjectId,
    topicId: activeTopicNumId ?? undefined,
  });

  const topicQuestions = useMemo<Question[]>(
    () =>
      activeTopicNumId === null
        ? []
        : (questionsRes?.data ?? [])
            .filter((q) => q.topicId === activeTopicNumId)
            .map(apiQuestionToUI),
    [questionsRes, activeTopicNumId],
  );

  // ─── Stats card data (for header) ─────────────────────────────────────────
  useGetQuestionBankStats(classId, subjectId);

  // ─── Header context (subject + class display names) ───────────────────────
  const subject = useMemo(
    () => teacherSubjects?.data?.find((s) => s.subjectId === subjectId),
    [teacherSubjects, subjectId],
  );
  const subjectName = subject?.subjectName ?? "Subject";

  const classDisplayName = useMemo(() => {
    const raw = classDetails as
      | { data?: { name?: string } }
      | { name?: string }
      | undefined;
    if (!raw) return "";
    if ("data" in raw && raw.data?.name) return raw.data.name;
    if ("name" in raw && typeof raw.name === "string") return raw.name;
    return "";
  }, [classDetails]);

  // Resolve branchId for the current subject from /subjects/class/{classId}
  const branchId = useMemo(() => {
    const list = classSubjects?.data ?? [];
    return list.find((s) => s.id === subjectId)?.branchId;
  }, [classSubjects, subjectId]);

  // ─── Mutations ────────────────────────────────────────────────────────────
  const addTopic = useAddCbtTopic();
  const updateTopic = useUpdateCbtTopic();
  const deleteTopic = useDeleteCbtTopic();
  const createQuestion = useCreateCbtQuestion();
  const updateQuestion = useUpdateCbtQuestion();
  const deleteQuestion = useDeleteCbtQuestion({ classId, subjectId });

  // ─── Local UI state ───────────────────────────────────────────────────────
  const [addTopicOpen, setAddTopicOpen] = useState(false);
  const [addTopicVersion, setAddTopicVersion] = useState(0);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType | null>(
    null,
  );
  const [newMaterialKind, setNewMaterialKind] = useState<MaterialKind | null>(
    null,
  );
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);

  // ─── Topic handlers ───────────────────────────────────────────────────────
  const handleAddTopic = ({ name, description }: TopicFormDraft) => {
    if (branchId === undefined) {
      toast.error("Branch not resolved yet");
      return;
    }
    addTopic.mutate(
      {
        name,
        description,
        classId,
        subjectId,
        branchId,
        displayOrder: apiTopics.length,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.id) setSelectedTopicId(String(res.data.id));
          toast.success("Topic added");
          setAddTopicOpen(false);
          setAddTopicVersion((v) => v + 1);
        },
      },
    );
  };

  const handleUpdateTopic = (
    topic: Topic,
    { name, description }: TopicFormDraft,
  ) => {
    if (branchId === undefined) {
      toast.error("Branch not resolved yet");
      return;
    }
    updateTopic.mutate(
      {
        id: Number(topic.id),
        payload: {
          name,
          description,
          classId,
          subjectId,
          branchId,
          displayOrder:
            apiTopics.find((t) => String(t.id) === topic.id)?.displayOrder ?? 0,
        },
      },
      {
        onSuccess: () => {
          toast.success("Topic updated");
          setEditingTopic(null);
        },
      },
    );
  };

  const handleDeleteTopic = (id: string) => {
    deleteTopic.mutate(Number(id), {
      onSuccess: () => toast.success("Topic deleted"),
    });
  };

  const handleReorderTopics = async (orderedIds: string[]) => {
    if (branchId === undefined) return;
    try {
      await Promise.all(
        orderedIds.map((tid, i) => {
          const t = apiTopics.find((a) => String(a.id) === tid);
          if (!t) return Promise.resolve(null);
          return updateTopic.mutateAsync({
            id: Number(tid),
            payload: {
              name: t.name,
              description: t.description ?? "",
              classId,
              subjectId,
              branchId,
              displayOrder: i,
            },
          });
        }),
      );
    } catch {
      // toast already surfaced via onError
    }
  };

  // ─── Question handlers ────────────────────────────────────────────────────
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
    if (!activeTopicNumId) return;
    const payload = questionToCreatePayload(q, {
      classId,
      subjectId,
      topicId: activeTopicNumId,
    });
    createQuestion.mutate(payload, {
      onSuccess: () => {
        toast.success("Question created");
        setNewQuestionType(null);
        setNewMaterialKind(null);
      },
    });
  };

  const handleInlineUpdateQuestion = (q: Question) => {
    if (!activeTopicNumId) return;
    const payload = questionToCreatePayload(q, {
      classId,
      subjectId,
      topicId: activeTopicNumId,
    });
    updateQuestion.mutate({ id: Number(q.id), payload });
  };

  const handleDuplicateQuestion = (id: string) => {
    if (!activeTopicNumId) return;
    const target = topicQuestions.find((q) => q.id === id);
    if (!target) return;
    const payload = questionToCreatePayload(target, {
      classId,
      subjectId,
      topicId: activeTopicNumId,
    });
    createQuestion.mutate(payload, {
      onSuccess: () => toast.success("Question duplicated"),
    });
  };

  const handleDeleteQuestion = (id: string) => {
    deleteQuestion.mutate(Number(id), {
      onSuccess: () => toast.success("Question deleted"),
    });
  };

  const handleSelectTopic = (id: string) => {
    setNewQuestionType(null);
    setNewMaterialKind(null);
    setSelectedTopicId(id);
  };

  // ─── Render guards ────────────────────────────────────────────────────────
  if (topicsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-text-muted)]" />
      </div>
    );
  }

  if (topicsError) {
    return (
      <div className="px-6 py-6">
        <EmptyState
          title="Could not load question bank"
          description="Please refresh the page and try again."
        />
      </div>
    );
  }

  const subjectTitle = "Question Bank";
  const subtitle = `${classDisplayName.replace(" ", "")} - ${subjectName}`;

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      <QuestionBankSidebar
        subjectTitle={subjectTitle}
        subtitle={subtitle}
        topics={subjectTopics}
        activeTopicId={activeTopicId}
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
      ) : questionsLoading ? (
        <section className="flex flex-1 items-center justify-center bg-[var(--color-bg-default)] px-6">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-text-muted)]" />
        </section>
      ) : (
        <QuestionListPanel
          topic={activeTopic}
          questions={topicQuestions}
          onAddQuestion={handleAddQuestion}
          onEditQuestion={(id) => router.push(`${baseUrl}/question-bank/${id}`)}
          onDuplicate={handleDuplicateQuestion}
          onDelete={handleDeleteQuestion}
          onReorder={() => {
            // No backend reorder endpoint — order is sourced from server
          }}
          newQuestionType={newQuestionType}
          newMaterialKind={newMaterialKind}
          onSaveNew={handleSaveNewQuestion}
          onCancelNew={() => {
            setNewQuestionType(null);
            setNewMaterialKind(null);
          }}
          onUpdateQuestion={handleInlineUpdateQuestion}
          savingNew={createQuestion.isPending}
        />
      )}

      <AddAssessmentItemModal
        open={addQuestionOpen}
        setOpen={setAddQuestionOpen}
        onSelectType={handleSelectQuestionType}
      />

      <TopicFormDialog
        key={`add-${addTopicVersion}`}
        open={addTopicOpen}
        setOpen={setAddTopicOpen}
        mode="add"
        loading={addTopic.isPending}
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
        initialDescription={
          editingTopic
            ? (apiTopics.find((t) => String(t.id) === editingTopic.id)
                ?.description ?? "")
            : ""
        }
        loading={updateTopic.isPending}
        onSubmit={(draft) => {
          if (editingTopic) handleUpdateTopic(editingTopic, draft);
        }}
      />

      <DeleteTopicDialog
        key={`delete-${deletingTopic?.id ?? "none"}`}
        open={deletingTopic !== null}
        setOpen={(o) => {
          if (!o) setDeletingTopic(null);
        }}
        onConfirm={() => {
          if (deletingTopic) handleDeleteTopic(deletingTopic.id);
          setDeletingTopic(null);
        }}
      />
    </div>
  );
};

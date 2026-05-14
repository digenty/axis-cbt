"use client";

import { use, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Cloud,
  FileText,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Star,
  Tag,
  Timer,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/PageHeader";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { QuestionBankModal } from "@/components/assessments/QuestionBankModal";
import { DeleteSectionDialog } from "@/components/assessments/DeleteSectionDialog";
import { RemoveQuestionDialog } from "@/components/assessments/RemoveQuestionDialog";
import { EditTestDetailsModal } from "@/components/assessments/EditTestDetailsModal";
import { AddAssessmentItemModal } from "@/components/question-bank/AddAssessmentItemModal";
import { QuestionEditForm } from "@/components/question-bank/QuestionEditForm";
import {
  apiQuestionToUI,
  apiToKebabType,
  questionToCreatePayload,
} from "@/types/question.mapper";
import {
  useGetClassDetails,
  useGetSubjectsByClassId,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import {
  useAddQuestionsToSection,
  useAddSection,
  useDeleteSection,
  useGetAssessment,
  useGetAssessmentSections,
  useGetAssessmentSettingsByClass,
  usePublishAssessment,
  useRemoveQuestionFromSection,
  useUpdateAssessment,
  useUpdateSection,
} from "@/hooks/queryHooks/useAssessment";
import {
  useDuplicateCbtQuestion,
  useGetQuestion,
  useGetQuestions,
  useGetTopics,
  useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import type { ApiAssessmentQuestion, ApiSection } from "@/types/question";
import type { Question, QuestionType } from "@/types";
import type { ApiTopic } from "@/types/question";
import type { Topic } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Draft } from "@digenty/icons";

interface TestEditorProps {
  params: Promise<{
    classId: string;
    subjectId: string;
    assessmentId: string;
  }>;
}

const apiTopicToUI = (t: ApiTopic): Topic => ({
  id: String(t.id),
  name: t.name,
  subjectId: t.subjectId,
  questions: [],
  createdAt: "",
});

// ─── Question group read-only preview ────────────────────────────────────────

const QuestionGroupPreview = ({
  question,
  onDelete,
}: {
  question: Question;
  onDelete: () => void;
}) => (
  <div className="flex flex-col gap-4 border-t border-[var(--color-border-default)] px-4 py-4">
    {question.passage && (
      <div
        className="rounded-md bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text-default)] [&_*]:!m-0 [&_*]:!p-0"
        dangerouslySetInnerHTML={{ __html: question.passage }}
      />
    )}

    {(question.subQuestions ?? []).map((sq, i) => (
      <div key={sq.id} className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <span className="shrink-0 rounded bg-[var(--color-bg-badge-gray)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-text-subtle)]">
            {i + 1}
          </span>
          <div
            className="flex-1 text-sm text-[var(--color-text-default)] [&_*]:!inline [&_*]:!m-0 [&_*]:!p-0"
            dangerouslySetInnerHTML={{ __html: sq.text }}
          />
          <span className="shrink-0 text-[11px] text-[var(--color-text-muted)]">
            {sq.marks} mark{sq.marks === 1 ? "" : "s"}
          </span>
        </div>
        {(sq.type === "multiple-choice" || sq.type === "multiple-answers") &&
          sq.options &&
          sq.options.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-[var(--color-text-muted)]">
                Options
              </span>
              {sq.options.map((opt, j) => (
                <div
                  key={opt.id}
                  className="flex items-center gap-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-input-soft)] px-3 py-2.5"
                >
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 shrink-0"
                  />
                  <span className="shrink-0 text-sm font-medium text-[var(--color-text-subtle)]">
                    {String.fromCharCode(65 + j)}.
                  </span>
                  <span
                    className="flex-1 text-sm text-[var(--color-text-default)] [&_*]:!inline [&_*]:!m-0 [&_*]:!p-0"
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                </div>
              ))}
            </div>
          )}
      </div>
    ))}

    <div className="flex items-center justify-end border-t border-[var(--color-border-default)] pt-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="text-[var(--color-text-destructive)] hover:bg-[var(--color-bg-destructive-soft)]"
      >
        Remove
      </Button>
    </div>
  </div>
);

// ─── Question row ─────────────────────────────────────────────────────────────

interface QuestionRowProps {
  aq: ApiAssessmentQuestion;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  classId: number;
  subjectId: number;
  topicId: number | null;
  section: ApiSection;
  updateQuestion: ReturnType<typeof useUpdateCbtQuestion>;
  onDuplicateQuestion: (questionId: number, sectionId: number) => void;
  onRemoveQuestion: (assessmentQuestionId: number) => void;
}

const QuestionRow = ({
  aq,
  index,
  isExpanded,
  onToggle,
  classId,
  subjectId,
  topicId,
  section,
  updateQuestion,
  onDuplicateQuestion,
  onRemoveQuestion,
}: QuestionRowProps) => {
  const { data: individualRes, isLoading: questionLoading } = useGetQuestion(
    isExpanded ? aq.id : 0,
  );

  const fullQuestion = individualRes?.data
    ? apiQuestionToUI(individualRes.data)
    : undefined;

  console.log(fullQuestion, individualRes?.data);
  return (
    <div
      className={cn(
        "rounded-lg border transition-colors hover:bg-[var(--color-bg-state-soft)]",
        isExpanded
          ? "border-blue-500 ring-1 ring-blue-500/20"
          : "border-[var(--color-border-default)]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-4.5 text-left"
      >
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-[var(--color-icon-default-muted)]" />
        <span className="shrink-0 rounded bg-[var(--color-bg-badge-gray)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-text-subtle)]">
          Q{index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-sm text-[var(--color-text-default)] [&_*]:!inline [&_*]:!m-0 [&_*]:!p-0"
            dangerouslySetInnerHTML={{
              __html: aq.questionText || "(untitled)",
            }}
          />
          <div className="mt-1 flex items-center gap-2">
            <QuestionTypeBadge type={apiToKebabType(aq.questionType)} />
            <span className="text-[11px] text-[var(--color-text-muted)]">
              • {aq.marks} mark{aq.marks === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--color-icon-default-muted)] transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {isExpanded &&
        (fullQuestion ? (
          aq.questionType === "QUESTION_GROUP" ? (
            <QuestionGroupPreview
              question={fullQuestion}
              onDelete={() => onRemoveQuestion(aq.assessmentQuestionId)}
            />
          ) : (
            <QuestionEditForm
              question={fullQuestion}
              onUpdate={(updated) => {
                const targetTopicId = topicId ?? fullQuestion.topicId;
                updateQuestion.mutate({
                  id: Number(updated.id),
                  payload: questionToCreatePayload(updated, {
                    classId,
                    subjectId,
                    topicId: Number(targetTopicId),
                  }),
                });
              }}
              onDuplicate={() =>
                onDuplicateQuestion(Number(fullQuestion.id), section.id)
              }
              onDelete={() => onRemoveQuestion(aq.assessmentQuestionId)}
            />
          )
        ) : questionLoading ? (
          <div className="flex justify-center px-3 pb-4">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--color-icon-default-muted)]" />
          </div>
        ) : null)}
    </div>
  );
};

// ─── Section panel ────────────────────────────────────────────────────────────

interface SectionPanelProps {
  section: ApiSection;
  classId: number;
  subjectId: number;
  topicId: number | null;
  bankQuestions: Question[];
  subjectTopics: Topic[];
  onRenameSection: (newTitle: string) => void;
  onUpdateInstructions: (instructions: string) => void;
  onDeleteSection: () => void;
  onAddFromBank: (questionIds: number[]) => void;
  onRemoveQuestion: (assessmentQuestionId: number) => void;
  onAddQuestion: (type: QuestionType, materialKind?: string) => void;
  onDuplicateQuestion: (questionId: number, sectionId: number) => void;
  busy: boolean;
}

const SectionPanel = ({
  section,
  classId,
  subjectId,
  topicId,
  bankQuestions,
  subjectTopics,
  onRenameSection,
  onUpdateInstructions,
  onDeleteSection,
  onAddFromBank,
  onRemoveQuestion,
  onAddQuestion,
  onDuplicateQuestion,
  busy,
}: SectionPanelProps) => {
  const updateQuestion = useUpdateCbtQuestion();
  const [open, setOpen] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [instructionsDraft, setInstructionsDraft] = useState<string | null>(
    null,
  );

  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const alreadyAddedQuestionIds = useMemo(
    () => section.questions.map((q) => String(q.id)),
    [section.questions],
  );

  return (
    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
      >
        <div className="flex flex-col items-start text-left">
          <span className="text-lg font-semibold text-[var(--color-text-default)]">
            {section.name}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            {section.instructions
              ? section.instructions
              : "Instructions (optional)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* <div
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              const name = window.prompt("Section name", section.name);
              if (name?.trim()) onRenameSection(name.trim());
            }}
            className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-default-subtle)]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </div> */}
          <div
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection();
            }}
            // disabled={busy}
            className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--color-icon-default-muted)] transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--color-border-default)] px-4 py-3">
          <div className="mb-3 space-y-1.5">
            <Label className="text-xs">Instructions (optional)</Label>
            <textarea
              rows={2}
              value={instructionsDraft ?? section.instructions ?? ""}
              onChange={(e) => setInstructionsDraft(e.target.value)}
              onBlur={() => {
                if (instructionsDraft === null) return;
                if (instructionsDraft !== (section.instructions ?? "")) {
                  onUpdateInstructions(instructionsDraft);
                }
                setInstructionsDraft(null);
              }}
              placeholder="Anything candidates should know about this section…"
              className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => setShowAddItemModal(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Question
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBankModal(true)}
            >
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              Add from Question Bank
            </Button>
          </div>

          {section.questions.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-7 w-7" />}
              title="No questions yet"
              description="Add question to get started"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddItemModal(true)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Question
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {section.questions.map((aq, i) => (
                <QuestionRow
                  key={aq.assessmentQuestionId ?? aq.id}
                  aq={aq}
                  index={i}
                  isExpanded={expandedIds.has(aq.id)}
                  onToggle={() => toggleExpand(aq.id)}
                  classId={classId}
                  subjectId={subjectId}
                  topicId={topicId}
                  section={section}
                  updateQuestion={updateQuestion}
                  onDuplicateQuestion={onDuplicateQuestion}
                  onRemoveQuestion={onRemoveQuestion}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <QuestionBankModal
        open={showBankModal}
        setOpen={setShowBankModal}
        questions={bankQuestions}
        alreadyAddedIds={alreadyAddedQuestionIds}
        topics={subjectTopics}
        onAdd={(ids) => onAddFromBank(ids.map((id) => Number(id)))}
      />

      <AddAssessmentItemModal
        open={showAddItemModal}
        setOpen={setShowAddItemModal}
        onSelectType={(type, materialKind) => {
          setShowAddItemModal(false);
          onAddQuestion(type, materialKind);
        }}
      />
    </div>
  );
};

// ─── Main editor ─────────────────────────────────────────────────────────────

export const TestEditor = ({ params }: TestEditorProps) => {
  const {
    classId: classIdStr,
    subjectId: subjectIdStr,
    assessmentId: assessmentIdStr,
  } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const assessmentId = Number(assessmentIdStr);
  const router = useRouter();

  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;

  // ─── Server data ─────────────────────────────────────────────────────────
  const { data: classDetails } = useGetClassDetails(classId);
  const { data: teacherSubjects } = useGetTeacherSubjects();
  const { data: classSubjects } = useGetSubjectsByClassId(classId);
  const {
    data: assessmentRes,
    isLoading: assessmentLoading,
    isError: assessmentError,
  } = useGetAssessment(assessmentId);
  const { data: sectionsRes, isLoading: sectionsLoading } =
    useGetAssessmentSections(assessmentId);
  const { data: settingsRes, isLoading: settingsLoading } =
    useGetAssessmentSettingsByClass(classId);
  const settings = useMemo(
    () => settingsRes?.data?.assessments ?? [],
    [settingsRes],
  );
  const { data: topicsRes } = useGetTopics({ classId, subjectId });
  const { data: questionsRes } = useGetQuestions({ classId, subjectId });

  const assessment = assessmentRes?.data;
  const sections = useMemo(() => sectionsRes?.data ?? [], [sectionsRes]);
  const subjectTopics = useMemo(
    () => (topicsRes?.data ?? []).map(apiTopicToUI),
    [topicsRes],
  );
  const bankQuestions = useMemo<Question[]>(
    () => (questionsRes?.data ?? []).map(apiQuestionToUI),
    [questionsRes],
  );

  const subjectName = useMemo(
    () =>
      teacherSubjects?.data?.find((s) => s.subjectId === subjectId)
        ?.subjectName ?? "",
    [teacherSubjects, subjectId],
  );

  const className = useMemo(() => {
    const raw = classDetails as
      | { data?: { name?: string } }
      | { name?: string }
      | undefined;
    if (!raw) return "";
    if ("data" in raw && raw.data?.name) return raw.data.name;
    if ("name" in raw && typeof raw.name === "string") return raw.name;
    return "";
  }, [classDetails]);

  const branchId = useMemo(
    () => classSubjects?.data?.find((s) => s.id === subjectId)?.branchId,
    [classSubjects, subjectId],
  );

  // ─── Mutations ───────────────────────────────────────────────────────────
  const updateMutation = useUpdateAssessment(assessmentId);
  const publishMutation = usePublishAssessment(assessmentId);
  const addSectionMutation = useAddSection(assessmentId);
  const deleteSectionMutation = useDeleteSection(assessmentId);
  const updateSectionMutation = useUpdateSection(assessmentId);
  const addQuestionsToSectionMutation = useAddQuestionsToSection(assessmentId);
  const removeQuestionMutation = useRemoveQuestionFromSection(assessmentId);
  const duplicateQuestionMutation = useDuplicateCbtQuestion({
    classId,
    subjectId,
  });

  // ─── Local UI state for the title editor ─────────────────────────────────
  const [deleteSectionTargetId, setDeleteSectionTargetId] = useState<
    number | null
  >(null);
  const [removeQuestionTargetId, setRemoveQuestionTargetId] = useState<
    number | null
  >(null);
  const [titleDraft, setTitleDraft] = useState<string | null>(null);
  const [editingDetails, setEditingDetails] = useState(false);

  const handleConfirmDeleteSection = () => {
    if (deleteSectionTargetId === null) return;
    deleteSectionMutation.mutate(deleteSectionTargetId, {
      onSuccess: () => {
        toast.success("Section deleted");
        setDeleteSectionTargetId(null);
      },
      onError: () => {
        toast.error("Failed to delete section");
        setDeleteSectionTargetId(null);
      },
    });
  };

  const handleConfirmRemoveQuestion = () => {
    if (removeQuestionTargetId === null) return;
    removeQuestionMutation.mutate(removeQuestionTargetId, {
      onSuccess: () => {
        toast.success("Question removed");
        setRemoveQuestionTargetId(null);
      },
      onError: () => {
        toast.error("Failed to remove question");
        setRemoveQuestionTargetId(null);
      },
    });
  };

  if (assessmentLoading || sectionsLoading) {
    return (
      <div className="flex justify-center px-6 py-12">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (assessmentError || !assessment) {
    return (
      <div className="px-6 py-6">
        <PageHeader
          title="Test not found"
          showBack
          backHref={`${baseUrl}/assessments`}
        />
      </div>
    );
  }

  const totalMarks = sections
    .flatMap((s) => s.questions)
    .reduce((acc, q) => acc + q.marks, 0);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const patchAssessment = (
    patch: Partial<Parameters<typeof updateMutation.mutate>[0]>,
  ) => {
    updateMutation.mutate(
      {
        name: assessment.name,
        classId: assessment.classId,
        subjectId: assessment.subjectId,
        branchId: assessment.branchId,
        term: assessment.term,
        testType: assessment.testType,
        assessmentSettingId: assessment.assessmentSettingId,
        durationMinutes: assessment.durationMinutes,
        totalMarks: assessment.totalMarks,
        passingMarks: assessment.passingMarks,
        startDateTime: assessment.startDateTime,
        endDateTime: assessment.endDateTime,
        instructions: assessment.instructions,
        shuffleQuestions: assessment.shuffleQuestions,
        shuffleOptions: assessment.shuffleOptions,
        showResultsImmediately: assessment.showResultsImmediately,
        allowReview: assessment.allowReview,
        ...patch,
      },
      {
        onError: () => toast.error("Failed to update test"),
      },
    );
  };

  const handlePublish = () => {
    publishMutation.mutate(undefined, {
      onSuccess: () => toast.success("Test published"),
      onError: () => toast.error("Failed to publish test"),
    });
  };

  const handleAddSection = () => {
    const letter = String.fromCharCode(65 + sections.length);
    addSectionMutation.mutate(
      {
        name: `Section ${letter}`,
        instructions: "",
        sectionOrder: sections.length + 1,
      },
      {
        onError: () => toast.error("Failed to add section"),
      },
    );
  };

  const handleAddQuestion = (
    type: QuestionType,
    materialKind?: string,
    sectionId?: number,
  ) => {
    const searchParams = new URLSearchParams({ type });
    if (materialKind) searchParams.set("materialKind", materialKind);
    searchParams.set("returnTo", `${baseUrl}/assessments/${assessmentIdStr}`);
    searchParams.set("assessmentId", assessmentIdStr);
    if (sectionId !== undefined)
      searchParams.set("sectionId", String(sectionId));
    router.push(`${baseUrl}/question-bank/new?${searchParams}`);
  };

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title={
          <input
            value={titleDraft ?? assessment.name}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={() => {
              if (titleDraft !== null && titleDraft !== assessment.name) {
                patchAssessment({ name: titleDraft });
              }
              setTitleDraft(null);
            }}
            className="bg-transparent text-lg font-semibold focus:outline-none"
          />
        }
        showBack
        backHref={`${baseUrl}/assessments`}
        right={
          <>
            {assessment.status === "DRAFT" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDetails((v) => !v)}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Edit Details
                </Button>
                <Button variant="outline" size="sm">
                  <Draft
                    fill="var(--color-icon-default-muted)"
                    className="mr-1 h-3.5 w-3.5"
                  />
                  Save as Draft
                </Button>
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={publishMutation.isPending}
                >
                  {publishMutation.isPending ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Cloud className="mr-1 h-3.5 w-3.5" />
                  )}
                  Publish Test
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                disabled
                className="bg-green-600 text-white opacity-100 hover:bg-green-600"
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                {assessment.status.charAt(0) +
                  assessment.status.slice(1).toLowerCase()}
              </Button>
            )}
          </>
        }
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-blue)] px-2 py-1 text-[11px] h-7 border border-bg-basic-blue-accent text-[var(--blue-700)]">
          <BookOpen className="h-3 w-3 text-bg-basic-blue-accent" />
          {className} • {subjectName}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-gray)] px-2 py-1 h-7 border border-bg-basic-gray-accent text-[11px] text-[var(--color-text-subtle)]">
          <FileText className="h-3 w-3" />
          {sections.reduce((n, s) => n + s.questions.length, 0)} questions
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-amber)] px-2 py-1 h-7 border border-bg-basic-amber-accent text-[11px] text-[var(--amber-700)]">
          <Star className="h-3 w-3" />
          {totalMarks} marks
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-purple)] px-2 py-1 h-7 border border-bg-basic-purple-accent text-[11px] text-[var(--purple-700)]">
          <Timer className="h-3 w-3" />
          {assessment.durationMinutes} minutes
        </span>
        {(() => {
          const matched = settings.find(
            (s) => s.id === assessment.assessmentSettingId,
          );
          if (!matched) return null;
          return (
            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-green)] px-2 py-1 h-7 border border-bg-basic-green-accent text-[11px] text-[var(--green-700)]">
              <Tag className="h-3 w-3" />
              {matched.name} ({matched.weight}%)
            </span>
          );
        })()}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {sections.map((section) => (
          <SectionPanel
            key={section.id}
            section={section}
            classId={classId}
            subjectId={subjectId}
            topicId={subjectTopics[0] ? Number(subjectTopics[0].id) : null}
            bankQuestions={bankQuestions}
            subjectTopics={subjectTopics}
            busy={
              deleteSectionMutation.isPending ||
              addQuestionsToSectionMutation.isPending ||
              removeQuestionMutation.isPending
            }
            onRenameSection={(name) =>
              updateSectionMutation.mutate(
                {
                  sectionId: section.id,
                  payload: {
                    name,
                    instructions: section.instructions ?? "",
                    sectionOrder: section.sectionOrder,
                    timeLimitMinutes: section.timeLimitMinutes,
                  },
                },
                {
                  onSuccess: () => toast.success("Section renamed"),
                  onError: () => toast.error("Failed to rename section"),
                },
              )
            }
            onUpdateInstructions={(instructions) =>
              updateSectionMutation.mutate(
                {
                  sectionId: section.id,
                  payload: {
                    name: section.name,
                    instructions,
                    sectionOrder: section.sectionOrder,
                    timeLimitMinutes: section.timeLimitMinutes,
                  },
                },
                {
                  onSuccess: () => toast.success("Instructions saved"),
                  onError: () => toast.error("Failed to save instructions"),
                },
              )
            }
            onDeleteSection={() => setDeleteSectionTargetId(section.id)}
            onAddFromBank={(ids) =>
              addQuestionsToSectionMutation.mutate(
                { sectionId: section.id, questionIds: ids },
                {
                  onSuccess: () => toast.success("Questions added"),
                  onError: () => toast.error("Failed to add questions"),
                },
              )
            }
            onRemoveQuestion={(aqId) => setRemoveQuestionTargetId(aqId)}
            onAddQuestion={(type, materialKind) =>
              handleAddQuestion(type, materialKind, section.id)
            }
            onDuplicateQuestion={(questionId, sectionId) =>
              duplicateQuestionMutation.mutate(questionId, {
                onSuccess: (res) => {
                  const newId = res.data?.id;
                  if (typeof newId === "number") {
                    addQuestionsToSectionMutation.mutate(
                      { sectionId, questionIds: [newId] },
                      {
                        onSuccess: () => toast.success("Question duplicated"),
                        onError: () =>
                          toast.error(
                            "Duplicated question, but failed to attach to section",
                          ),
                      },
                    );
                  } else {
                    toast.success("Question duplicated");
                  }
                },
                onError: () => toast.error("Failed to duplicate question"),
              })
            }
          />
        ))}

        <button
          type="button"
          onClick={handleAddSection}
          disabled={addSectionMutation.isPending}
          className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-card)] py-3 text-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)] disabled:opacity-50"
        >
          {addSectionMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Add New Section
        </button>
      </div>

      <DeleteSectionDialog
        open={deleteSectionTargetId !== null}
        setOpen={(open) => {
          if (!open) setDeleteSectionTargetId(null);
        }}
        onConfirm={handleConfirmDeleteSection}
        isLoading={deleteSectionMutation.isPending}
      />

      <RemoveQuestionDialog
        open={removeQuestionTargetId !== null}
        setOpen={(open) => {
          if (!open) setRemoveQuestionTargetId(null);
        }}
        onConfirm={handleConfirmRemoveQuestion}
        isLoading={removeQuestionMutation.isPending}
      />

      <EditTestDetailsModal
        open={editingDetails}
        setOpen={setEditingDetails}
        assessment={assessment}
        classId={classId}
        subjectId={subjectId}
        branchId={branchId}
        className={className}
        subjectName={subjectName}
        settings={settings}
        settingsLoading={settingsLoading}
        onSave={(patch) =>
          updateMutation.mutate(patch, {
            onSuccess: () => {
              toast.success("Test updated");
              setEditingDetails(false);
            },
            onError: () => toast.error("Failed to update test"),
          })
        }
        saving={updateMutation.isPending}
      />
    </div>
  );
};

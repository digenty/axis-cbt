/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  GripVertical,
  MessageSquare,
  Pencil,
  Plus,
  Save,
  Star,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getQuestionTypeBadge, getQuestionTypeLabel } from "@/utils/question";
import { CreateTestModal } from "./CreateTestModal";
import { AddAssessmentItemModal } from "./AddAssessmentItemModal";
import { SelectFromQuestionBankModal } from "./SelectFromQuestionBankModal";
import {
  useAddQuestionsToSection,
  useCreateSection,
  useDeleteAssessmentQuestion,
  useDeleteSection,
  useGetAssessment,
  useGetSections,
  usePublishAssessment,
  useUpdateAssessment,
} from "@/hooks/queryHooks/useAssessment";
import {
  useGetClassDetails,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import { BackButton } from "./PageHeader";
import { useGetTopics } from "@/hooks/queryHooks/useQuestionBank";
import { AddQuestionForm } from "./AddQuestionForm";
import { FillInBlanksForm } from "./FillInBlanksForm";
import { QuestionGroupForm } from "./QuestionGroupForm";
import { toast } from "@/components/Toast";
import type {
  ApiAssessment,
  ApiSection,
  UpdateAssessmentPayload,
} from "@/types/assessment";
import {
  MAPPING_SHORT,
  TERM_LABELS,
  TEST_TYPE_LABELS,
} from "@/types/assessment";
import type { ApiQuestion, ApiTopic, QuestionType } from "@/types/question";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TestEditorProps {
  assessmentUuid: string;
  classId: number;
  subjectId: number;
  backHref?: string;
}

// ─── Local section / question shapes ──────────────────────────────────────────

interface LocalQuestion extends ApiQuestion {
  aqId?: number;
}

interface LocalSection {
  id?: number;
  localId: string;
  name: string;
  instructions: string;
  sectionOrder: number;
  timeLimitMinutes: number;
  questions: LocalQuestion[];
}

let _localCounter = 1;
const newLocalId = () => `local-${_localCounter++}`;

function apiSectionToLocal(s: ApiSection): LocalSection {
  return {
    id: s?.id,
    localId: newLocalId(),
    name: s?.name,
    instructions: s?.instructions ?? "",
    sectionOrder: s?.sectionOrder,
    timeLimitMinutes: s?.timeLimitMinutes,
    questions: [],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TestEditor = ({
  assessmentUuid,
  classId,
  subjectId,
  backHref,
}: TestEditorProps) => {
  const { data: assessmentResponse, isLoading: isLoadingAssessment } =
    useGetAssessment(Number(assessmentUuid));
  const assessment: ApiAssessment | undefined = assessmentResponse?.data;

  const { data: classDetailsResponse } = useGetClassDetails(classId);
  const className = classDetailsResponse?.data?.name;

  const { data: subjectsResponse } = useGetTeacherSubjects();
  const subjectName = subjectsResponse?.data?.find(
    (s: { subjectId: number; subjectName: string }) =>
      s.subjectId === subjectId,
  )?.subjectName;

  const { data: topicsResponse } = useGetTopics({ classId, subjectId });
  const topics: ApiTopic[] = topicsResponse?.data ?? [];

  const { data: sectionsResponse, isLoading: isLoadingSections } =
    useGetSections(assessment?.id ?? 0);

  const allSections = sectionsResponse?.data;

  const { mutateAsync: updateAssessment, isPending: isSaving } =
    useUpdateAssessment();
  const { mutateAsync: publishAssessment, isPending: isPublishing } =
    usePublishAssessment();
  const { mutateAsync: createSection, isPending: isCreatingSection } =
    useCreateSection(assessment?.id ?? 0);
  const { mutateAsync: removeSectionApi } = useDeleteSection(
    assessment?.id ?? 0,
  );
  const { mutateAsync: addQuestionsApi, isPending: isAddingQuestions } =
    useAddQuestionsToSection(assessment?.id ?? 0);
  const { mutateAsync: deleteAqApi } = useDeleteAssessmentQuestion(
    assessment?.id ?? 0,
  );

  const [sections, setSections] = useState<LocalSection[]>([]);
  const [sectionsInitialized, setSectionsInitialized] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [addItemModal, setAddItemModal] = useState<{
    localId: string;
  } | null>(null);
  const [selectFromBankModal, setSelectFromBankModal] = useState<{
    localId: string;
  } | null>(null);
  const [newQuestionState, setNewQuestionState] = useState<{
    localId: string;
    questionType: QuestionType;
    topicId: number | null;
  } | null>(null);

  // Sync sections from API on first load
  useEffect(() => {
    if (!sectionsInitialized && allSections) {
      setSections(allSections?.map(apiSectionToLocal));
      setSectionsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSections]);

  // Derived totals
  const totalQuestions = sections?.reduce(
    (s, sec) => s + sec?.questions?.length,
    0,
  );
  const totalMarks = sections?.reduce(
    (s, sec) => s + sec?.questions?.reduce((ss, q) => ss + (q.marks ?? 0), 0),
    0,
  );

  const alreadySelectedIds = sections?.flatMap((s) =>
    s.questions?.map((q) => q.id),
  );

  // ── Section helpers ────────────────────────────────────────────────────────

  const updateSectionLocal = (localId: string, patch: Partial<LocalSection>) =>
    setSections((prev) =>
      prev.map((s) => (s.localId === localId ? { ...s, ...patch } : s)),
    );

  const handleAddSection = async () => {
    if (!assessment) return;
    const sectionOrder = sections?.length;
    const name = `Section ${String.fromCharCode(65 + sectionOrder)}`;
    try {
      const res = await createSection({
        name,
        instructions: "",
        sectionOrder,
        timeLimitMinutes: 0,
      });
      setSections((prev) => [...prev, apiSectionToLocal(res?.data)]);
    } catch {
      toast({ title: "Could not add section", type: "error" });
    }
  };

  const handleDeleteSection = async (localId: string, sectionId?: number) => {
    if (sectionId) {
      try {
        await removeSectionApi(sectionId);
      } catch {
        toast({ title: "Could not delete section", type: "error" });
        return;
      }
    }
    setSections((prev) => prev.filter((s) => s.localId !== localId));
  };

  const handleAddQuestionsFromBank = async (
    localId: string,
    questions: ApiQuestion[],
  ) => {
    const section = sections?.find((s) => s.localId === localId);
    if (!section) return;

    const newQuestions = questions?.filter(
      (q) => !section?.questions?.some((sq) => sq.id === q.id),
    );
    if (!newQuestions?.length) return;

    if (section?.id) {
      // Optimistically add to the list immediately for instant feedback
      setSections((prev) =>
        prev.map((s) =>
          s.localId !== localId
            ? s
            : {
                ...s,
                questions: [
                  ...s.questions,
                  ...newQuestions?.map((q) => ({
                    ...q,
                    aqId: undefined,
                  })),
                ],
              },
        ),
      );
      try {
        await addQuestionsApi({
          sectionId: section?.id,
          questionIds: newQuestions?.map((q) => q.id),
        });
      } catch {
        toast({
          title: "Could not save questions to server",
          type: "error",
        });
      }
    } else {
      // Section not yet persisted — add locally only
      setSections((prev) =>
        prev.map((s) =>
          s.localId !== localId
            ? s
            : {
                ...s,
                questions: [
                  ...s?.questions,
                  ...newQuestions?.map((q) => ({
                    ...q,
                    aqId: undefined,
                  })),
                ],
              },
        ),
      );
    }
  };

  const handleRemoveQuestion = async (
    localId: string,
    questionId: number,
    aqId?: number,
  ) => {
    if (aqId) {
      try {
        await deleteAqApi(aqId);
      } catch {
        toast({ title: "Could not remove question", type: "error" });
        return;
      }
    }
    setSections((prev) =>
      prev.map((s) =>
        s.localId !== localId
          ? s
          : {
              ...s,
              questions: s?.questions?.filter((q) => q.id !== questionId),
            },
      ),
    );
  };

  const handleReorderQuestions = (localId: string, orderedIds: number[]) =>
    setSections((prev) =>
      prev.map((s) => {
        if (s.localId !== localId) return s;
        const map = new Map(s?.questions?.map((q) => [q.id, q]));
        return {
          ...s,
          questions: orderedIds
            .map((id) => map.get(id))
            .filter(Boolean) as LocalQuestion[],
        };
      }),
    );

  // ── Save / Publish ─────────────────────────────────────────────────────────

  const buildPayload = (): UpdateAssessmentPayload => {
    if (!assessment) return {};
    return {
      name: assessment?.name,
      classId,
      subjectId,
      branchId: assessment?.branchId,
      term: assessment?.term,
      testType: assessment?.testType,
      assessmentMapping: assessment?.assessmentMapping,
      durationMinutes: assessment?.durationMinutes,
      passingMarks: assessment?.passingMarks,
      startDateTime: assessment?.startDateTime,
      endDateTime: assessment?.endDateTime,
      instructions: assessment?.instructions,
      shuffleQuestions: assessment?.shuffleQuestions,
      shuffleOptions: assessment?.shuffleOptions,
      showResultsImmediately: assessment?.showResultsImmediately,
      allowReview: assessment?.allowReview,
    };
  };

  const handleSaveDraft = async () => {
    if (!assessment) return;
    try {
      await updateAssessment({
        id: assessment?.id,
        payload: buildPayload(),
      });
      toast({ title: "Saved as draft", type: "success" });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Could not save";
      toast({ title: msg, type: "error" });
    }
  };

  const handlePublish = async () => {
    if (!assessment) return;
    try {
      await updateAssessment({
        id: assessment?.id,
        payload: buildPayload(),
      });
      await publishAssessment(assessment?.id);
      toast({ title: "Test published", type: "success" });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Could not publish";
      toast({ title: msg, type: "error" });
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoadingAssessment || isLoadingSections || !assessment) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {backHref && <BackButton href={backHref} />}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {assessment?.name}
              </h1>
              <p className="mt-0.5 text-xs text-gray-400">
                {TERM_LABELS[assessment?.term]} •{" "}
                {TEST_TYPE_LABELS[assessment?.testType]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditDetailsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Details
            </button>
            {assessment?.status !== "PUBLISHED" && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60"
              >
                {isSaving ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-gray-800" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save Draft
              </button>
            )}
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {isPublishing ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              Publish Test
            </button>
          </div>
        </div>

        {/* Meta badges */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {className && (
            <MetaBadge
              color="blue"
              icon={<BookOpen className="h-3 w-3" />}
              label={`${className}${subjectName ? ` • ${subjectName}` : ""}`}
            />
          )}
          <MetaBadge
            color="gray"
            icon={<MessageSquare className="h-3 w-3" />}
            label={`${totalQuestions ?? 0} question${totalQuestions !== 1 ? "s" : ""}`}
          />
          <MetaBadge
            color="amber"
            icon={<Star className="h-3 w-3" />}
            label={`${totalMarks ?? 0} marks`}
          />
          {assessment?.durationMinutes && (
            <MetaBadge
              color="purple"
              icon={<Clock className="h-3 w-3" />}
              label={`${assessment?.durationMinutes} min`}
            />
          )}
          {assessment?.assessmentMapping && (
            <MetaBadge
              color="green"
              icon={<Tag className="h-3 w-3" />}
              label={MAPPING_SHORT[assessment?.assessmentMapping]}
            />
          )}
          {assessment?.startDateTime && (
            <MetaBadge
              color="gray"
              icon={<Calendar className="h-3 w-3" />}
              label={new Date(assessment?.startDateTime).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            />
          )}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections?.map((section) => (
            <SectionCard
              key={section.localId}
              section={section}
              classId={classId}
              subjectId={subjectId}
              topics={topics}
              isAddingQuestions={isAddingQuestions}
              inlineForm={
                newQuestionState?.localId === section.localId
                  ? {
                      questionType: newQuestionState?.questionType,
                      topicId: newQuestionState?.topicId,
                    }
                  : null
              }
              onTopicChange={(id) =>
                setNewQuestionState((prev) => prev && { ...prev, topicId: id })
              }
              onCloseInlineForm={() => setNewQuestionState(null)}
              onQuestionSaved={(question) => {
                setNewQuestionState(null);
                if (question) {
                  handleAddQuestionsFromBank(section?.localId, [question]);
                }
              }}
              onUpdateSection={(patch) =>
                updateSectionLocal(section?.localId, patch)
              }
              onReorder={(ids) => handleReorderQuestions(section?.localId, ids)}
              onRemoveQuestion={(qId, aqId) =>
                handleRemoveQuestion(section?.localId, qId, aqId)
              }
              onAddQuestion={() =>
                setAddItemModal({ localId: section?.localId })
              }
              onAddFromBank={() =>
                setSelectFromBankModal({ localId: section?.localId })
              }
              onDeleteSection={() =>
                handleDeleteSection(section?.localId, section?.id)
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSection}
          disabled={isCreatingSection}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3.5 text-sm text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600 disabled:opacity-60"
        >
          {isCreatingSection ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-t-gray-600" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add New Section
        </button>
      </div>

      {/* Edit details modal */}
      <CreateTestModal
        open={editDetailsOpen}
        onClose={() => setEditDetailsOpen(false)}
        classId={classId}
        subjectId={subjectId}
        branchId={assessment?.branchId}
        editAssessment={assessment}
        onSaved={() => setEditDetailsOpen(false)}
      />

      {/* Add question type picker */}
      <AddAssessmentItemModal
        open={!!addItemModal}
        onClose={() => setAddItemModal(null)}
        onSelectType={(type) => {
          const localId = addItemModal?.localId ?? "";
          setAddItemModal(null);
          setNewQuestionState({
            localId,
            questionType: type,
            topicId: topics?.[0]?.id ?? null,
          });
        }}
      />

      {/* Select from question bank */}
      {selectFromBankModal && (
        <SelectFromQuestionBankModal
          open
          classId={classId}
          subjectId={subjectId}
          alreadySelectedIds={alreadySelectedIds}
          onClose={() => setSelectFromBankModal(null)}
          onAdd={(qs) => {
            handleAddQuestionsFromBank(selectFromBankModal.localId, qs);
            setSelectFromBankModal(null);
          }}
        />
      )}
    </>
  );
};

// ─── Meta badge ───────────────────────────────────────────────────────────────

const BADGE_COLORS: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  gray: "bg-gray-100 text-gray-700 border-gray-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  green: "bg-green-50 text-green-700 border-green-200",
};

const MetaBadge = ({
  color,
  icon,
  label,
}: {
  color: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <span
    className={cn(
      "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
      BADGE_COLORS[color] ?? BADGE_COLORS.gray,
    )}
  >
    {icon}
    {label}
  </span>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  section,
  classId,
  subjectId,
  topics,
  isAddingQuestions,
  inlineForm,
  onTopicChange,
  onCloseInlineForm,
  onQuestionSaved,
  onUpdateSection,
  onReorder,
  onRemoveQuestion,
  onAddQuestion,
  onAddFromBank,
  onDeleteSection,
}: {
  section: LocalSection;
  classId: number;
  subjectId: number;
  topics: ApiTopic[];
  isAddingQuestions: boolean;
  inlineForm: { questionType: QuestionType; topicId: number | null } | null;
  onTopicChange: (id: number) => void;
  onCloseInlineForm: () => void;
  onQuestionSaved: (question?: ApiQuestion) => void;
  onUpdateSection: (patch: Partial<LocalSection>) => void;
  onReorder: (ids: number[]) => void;
  onRemoveQuestion: (questionId: number, aqId?: number) => void;
  onAddQuestion: () => void;
  onAddFromBank: () => void;
  onDeleteSection: () => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const resolvedTopicId = inlineForm?.topicId ?? topics?.[0]?.id ?? 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = section.questions.map((q) => q.id);
    const oldIdx = ids.indexOf(Number(active.id));
    const newIdx = ids.indexOf(Number(over.id));
    onReorder(arrayMove(ids, oldIdx, newIdx));
  };

  console.log({ sectionQues: section?.questions, inlineForm });

  return (
    <div className="group/section overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={section?.name}
            onChange={(e) => onUpdateSection({ name: e.target.value })}
            className="w-full border-0 bg-transparent text-base font-semibold text-gray-900 focus:ring-0 focus:outline-none"
          />
          <input
            type="text"
            value={section?.instructions}
            onChange={(e) => onUpdateSection({ instructions: e.target.value })}
            placeholder="Instructions (optional)"
            className="mt-0.5 w-full border-0 bg-transparent text-xs text-gray-400 placeholder:text-gray-300 focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="ml-4 flex items-center gap-1">
          <button
            type="button"
            onClick={onDeleteSection}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 opacity-0 transition-all group-hover/section:opacity-100 hover:bg-red-50 hover:text-red-500"
            title="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-gray-600"
          >
            {collapsed ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div>
          {/* Inline question form — replaces button row */}
          {inlineForm ? (
            <div className="flex h-[520px] flex-col overflow-hidden border-t border-gray-100">
              {/* Topic selector (only when multiple topics) */}
              {topics?.length > 1 && (
                <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-5 py-2.5">
                  <label className="text-xs text-gray-500">Topic</label>
                  <select
                    value={resolvedTopicId}
                    onChange={(e) => onTopicChange(Number(e.target.value))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    {topics?.map((t) => (
                      <option key={t?.id} value={t?.id}>
                        {t?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {!resolvedTopicId ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                  <p className="text-sm text-gray-500">
                    No topics found for this subject.
                  </p>
                  <p className="text-xs text-gray-400">
                    Create a topic in the Question Bank first.
                  </p>
                  <button
                    type="button"
                    onClick={onCloseInlineForm}
                    className="mt-1 rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 overflow-hidden">
                  {(inlineForm?.questionType === "QUESTION_GROUP" ||
                    inlineForm?.questionType === "COMPREHENSION") && (
                    <QuestionGroupForm
                      classId={classId}
                      subjectId={subjectId}
                      topicId={resolvedTopicId}
                      initialQuestionType={inlineForm?.questionType}
                      onClose={onCloseInlineForm}
                      onSaved={onQuestionSaved}
                    />
                  )}
                  {inlineForm?.questionType === "FILL_IN_THE_BLANK" && (
                    <FillInBlanksForm
                      classId={classId}
                      subjectId={subjectId}
                      topicId={resolvedTopicId}
                      onClose={onCloseInlineForm}
                      onSaved={onQuestionSaved}
                    />
                  )}
                  {inlineForm?.questionType !== "QUESTION_GROUP" &&
                    inlineForm?.questionType !== "COMPREHENSION" &&
                    inlineForm?.questionType !== "FILL_IN_THE_BLANK" && (
                      <AddQuestionForm
                        classId={classId}
                        subjectId={subjectId}
                        topicId={resolvedTopicId}
                        onClose={onCloseInlineForm}
                        onSaved={onQuestionSaved}
                      />
                    )}
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 py-4">
              {/* Action buttons */}
              <div className="mb-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onAddQuestion}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Question
                </button>
                <button
                  type="button"
                  onClick={onAddFromBank}
                  disabled={isAddingQuestions}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  {isAddingQuestions ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-t-gray-700" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5" />
                  )}
                  Add from Question Bank
                </button>
              </div>
            </div>
          )}

          {/* Questions — always visible below */}
          {!inlineForm && (
            <div className="px-5 pb-4">
              {section?.questions?.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center">
                  <p className="mb-1 text-sm text-gray-500">No questions yet</p>
                  <p className="mb-3 text-xs text-gray-400">
                    Add from the question bank to get started
                  </p>
                  <button
                    type="button"
                    onClick={onAddFromBank}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-1.5 text-sm transition-colors hover:bg-gray-50"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Add from Question Bank
                  </button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={
                      section?.questions
                        ? section?.questions?.map((q) => q?.id)
                        : []
                    }
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {section?.questions?.map((q, idx) => (
                        <SortableQuestionRow
                          key={q.id}
                          question={q}
                          number={idx + 1}
                          onRemove={() => onRemoveQuestion(q.id, q.aqId)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {section?.questions?.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onAddQuestion}
                    className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Question
                  </button>
                  <button
                    type="button"
                    onClick={onAddFromBank}
                    className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Add from Question Bank
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Sortable question row ─────────────────────────────────────────────────────

const SortableQuestionRow = ({
  question,
  number,
  onRemove,
}: {
  question: LocalQuestion;
  number: number;
  onRemove: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const qType = question?.questionType as QuestionType;
  const tsd = question?.typeSpecificData;
  const isGroup = qType === "QUESTION_GROUP" || qType === "COMPREHENSION";
  const subCount = isGroup ? ((tsd as any)?.subQuestions?.length ?? 0) : 0;

  console.log({ tsd, question });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white transition-all",
        isDragging && "shadow-lg ring-2 ring-blue-200",
      )}
    >
      <div className="group flex items-center gap-3 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="shrink-0 cursor-grab text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:text-gray-500 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="w-7 shrink-0 text-xs font-semibold text-gray-400">
          Q{number}
        </span>

        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => setExpanded((v) => !v)}
        >
          <p className="truncate text-sm font-medium text-gray-800">
            {question?.questionText}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-xs",
                getQuestionTypeBadge(qType),
              )}
            >
              {getQuestionTypeLabel(qType)}
            </span>
            <span className="text-xs text-gray-400">
              • {question?.marks} mark{question?.marks !== 1 ? "s" : ""}
            </span>
            {isGroup && subCount > 0 && (
              <span className="text-xs text-gray-400">
                • {subCount} sub-question{subCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <div
          className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onRemove}
            className="flex h-6 w-6 items-center justify-center text-gray-300 transition-colors hover:text-red-500"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expanded preview */}
      {expanded && tsd && (
        <>
          {(tsd?.questionType === "MULTIPLE_CHOICE" ||
            tsd?.questionType === "MULTIPLE_ANSWERS") && (
            <div className="space-y-1.5 border-t border-gray-100 bg-gray-50/50 px-10 py-3">
              {tsd?.options.map((opt) => (
                <div
                  key={opt.optionLabel}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
                >
                  <span className="w-4 font-mono uppercase text-gray-400">
                    {opt.optionLabel}.
                  </span>
                  {opt.optionText || <em className="text-gray-300">—</em>}
                </div>
              ))}
            </div>
          )}

          {tsd?.questionType === "TRUE_FALSE" && (
            <div className="flex gap-2 border-t border-gray-100 bg-gray-50/50 px-10 py-3">
              {["True", "False"].map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1 text-xs text-gray-600"
                >
                  {l}
                </span>
              ))}
            </div>
          )}

          {tsd?.questionType === "SHORT_ANSWER" && (
            <p className="border-t border-gray-100 bg-gray-50/50 px-10 py-3 text-xs italic text-gray-400">
              Students type a short response.
            </p>
          )}

          {tsd?.questionType === "FILL_IN_THE_BLANK" &&
            (tsd?.blanks ?? []).length > 0 && (
              <div className="space-y-1 border-t border-gray-100 bg-gray-50/50 px-10 py-3">
                {(tsd?.blanks ?? []).map((b, i) => (
                  <p key={i} className="text-xs text-gray-600">
                    {b.blankLabel || `Blank ${i + 1}`}
                    {b.marks ? ` — ${b.marks} mk` : ""}
                  </p>
                ))}
              </div>
            )}

          {(tsd?.questionType === "QUESTION_GROUP" ||
            tsd?.questionType === "COMPREHENSION") &&
            (tsd as any)?.subQuestions?.length > 0 && (
              <div className="space-y-1 border-t border-gray-100 bg-gray-50/50 px-10 py-3">
                {(tsd as any).subQuestions.map((sq: any, i: number) => (
                  <p key={i} className="text-xs text-gray-600">
                    {i + 1}. {sq.questionText}
                  </p>
                ))}
              </div>
            )}
        </>
      )}
    </div>
  );
};

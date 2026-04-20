"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useGetAssessment,
  useGetAssessmentSections,
  useAddSection,
  useDeleteSection,
  useAddQuestionsToSection,
  useRemoveQuestionFromSection,
  usePublishAssessment,
} from "@/hooks/queryHooks/useAssessment";
import { useQueries } from "@tanstack/react-query";
import { getCbtQuestion } from "@/api/question";
import { questionBankKeys } from "@/hooks/queryHooks/useQuestionBank";
import type {
  ApiAssessment,
  ApiSection,
  ApiAssessmentQuestion,
  ApiQuestion,
} from "@/types/question";
import type { QuestionType } from "@/types";
import {
  cn,
  getQuestionTypeLabel,
  getQuestionTypeBadgeColor,
} from "@/lib/utils";
import {
  Pencil,
  Upload,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageSquare,
  Star,
  Clock,
  Tag,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { SelectFromQuestionBankModal } from "@/components/question-bank/QuestionBankModal";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map API SCREAMING_SNAKE_CASE question types → display kebab-case */
const API_TO_DISPLAY_TYPE: Record<string, QuestionType> = {
  MULTIPLE_CHOICE: "multiple-choice",
  MULTIPLE_ANSWERS: "multiple-answers",
  TRUE_FALSE: "true-false",
  ESSAY: "essay",
  SHORT_ANSWER: "short-answer",
  NUMERIC_ANSWER: "numerical",
  FILL_IN_THE_BLANK: "fill-in-blank",
  MATCH: "matching",
  QUESTION_GROUP: "question-group",
  COMPREHENSION: "comprehension-passage",
};

function toDisplayType(apiType: string): QuestionType {
  return API_TO_DISPLAY_TYPE[apiType] ?? "multiple-choice";
}

const TERM_LABELS: Record<string, string> = {
  FIRST: "First Term",
  SECOND: "Second Term",
  THIRD: "Third Term",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  COMPLETED: "Completed",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface TestEditorProps {
  assessmentId: number;
  classId: number;
  subjectId: number;
  className: string;
  subjectName: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TestEditor = ({
  assessmentId,
  classId,
  subjectId,
  className,
  subjectName,
}: TestEditorProps) => {
  const { data: assessmentRes, isLoading: loadingAssessment } =
    useGetAssessment(assessmentId);
  const { data: sectionsRes, isLoading: loadingSections } =
    useGetAssessmentSections(assessmentId);

  const [localSections, setLocalSections] = useState<ApiSection[]>([]);
  const [assessment, setAssessment] = useState<ApiAssessment | null>(null);

  const [selectFromBankOpen, setSelectFromBankOpen] = useState<{
    sectionId: number;
  } | null>(null);
  const [publishing, setPublishing] = useState(false);

  const { mutateAsync: addSectionApi } = useAddSection(assessmentId);
  const { mutateAsync: deleteSectionApi } = useDeleteSection(assessmentId);
  const { mutateAsync: addQuestionsApi } =
    useAddQuestionsToSection(assessmentId);
  const { mutateAsync: removeQuestionApi } =
    useRemoveQuestionFromSection(assessmentId);
  const { mutateAsync: publishApi } = usePublishAssessment(assessmentId);

  // Sync local state from queries
  useEffect(() => {
    if (assessmentRes?.data) setAssessment(assessmentRes.data);
  }, [assessmentRes]);

  useEffect(() => {
    if (sectionsRes?.data) setLocalSections(sectionsRes?.data);
  }, [sectionsRes]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const totalQuestions = localSections?.reduce(
    (sum, s) => sum + s?.questions?.length,
    0,
  );
  const totalMarks = localSections?.reduce(
    (sum, s) => sum + s?.questions?.reduce((qs, q) => qs + q?.marks, 0),
    0,
  );

  // Already-added question IDs (for the bank modal)
  const alreadySelectedIds = localSections?.flatMap((s) =>
    s?.questions?.map((q) => q?.questionId),
  );

  // ── Section operations ────────────────────────────────────────────────────

  const handleAddSection = async () => {
    const order = localSections?.length + 1;
    const name = `Section ${String.fromCharCode(64 + order)}`;
    try {
      const res = await addSectionApi({
        name,
        instructions: "",
        sectionOrder: order,
      });
      setLocalSections((prev) => [...prev, res?.data]);
    } catch {
      toast.error("Failed to add section");
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    try {
      await deleteSectionApi(sectionId);
      setLocalSections((prev) => prev.filter((s) => s?.id !== sectionId));
    } catch {
      toast.error("Failed to delete section");
    }
  };

  // ── Question operations ───────────────────────────────────────────────────

  const handleAddFromBank = async (
    sectionId: number,
    questionIds: number[],
  ) => {
    if (questionIds?.length === 0) return;
    try {
      await addQuestionsApi({ sectionId, questionIds });
      // sectionsRes will be invalidated by the hook; useEffect syncs localSections
    } catch {
      toast.error("Failed to add questions");
    }
  };

  const handleRemoveQuestion = async (assessmentQuestionId: number) => {
    // Optimistic remove
    setLocalSections((prev) =>
      prev.map((s) => ({
        ...s,
        questions: s?.questions?.filter(
          (q) => q?.assessmentQuestionId !== assessmentQuestionId,
        ),
      })),
    );
    try {
      await removeQuestionApi(assessmentQuestionId);
    } catch {
      toast.error("Failed to remove question");
      // Re-sync from server
      if (sectionsRes?.data) setLocalSections(sectionsRes?.data);
    }
  };

  const handleReorder = (sectionId: number, orderedIds: number[]) => {
    setLocalSections((prev) =>
      prev.map((s) => {
        if (s?.id !== sectionId) return s;
        const reordered = orderedIds
          .map((id) =>
            s?.questions?.find((q) => q?.assessmentQuestionId === id),
          )
          .filter(Boolean) as ApiAssessmentQuestion[];
        return { ...s, questions: reordered };
      }),
    );
  };

  // ── Publish ───────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await publishApi();
      setAssessment((prev) => (prev ? { ...prev, status: "PUBLISHED" } : prev));
      toast.success("Test published successfully");
    } catch {
      toast.error("Failed to publish test");
    } finally {
      setPublishing(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loadingAssessment || loadingSections) {
    return (
      <div className="w-full animate-pulse space-y-4">
        <div className="h-8 w-64 rounded-lg bg-gray-200" />
        <div className="h-4 w-96 rounded-lg bg-gray-100" />
        <div className="h-48 rounded-xl bg-gray-100" />
        <div className="h-48 rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-3 h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-500">Assessment not found</p>
      </div>
    );
  }

  // ── Cumulative Q numbering ────────────────────────────────────────────────

  let qCounter = 0;
  const sectionStartIndices = localSections.map((s) => {
    const start = qCounter;
    qCounter += s?.questions?.length;
    return start;
  });

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {assessment?.name}
            </h1>
            <p className="mt-0.5 text-xs text-gray-400">
              {className} • {subjectName} •{" "}
              {TERM_LABELS[assessment?.term] ?? assessment?.term}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("Edit details — connect to update API")}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Details
            </button>
            {assessment?.status !== "PUBLISHED" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {publishing ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Publish Test
              </button>
            )}
            {assessment?.status === "PUBLISHED" && (
              <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                {STATUS_LABELS[assessment?.status]}
              </span>
            )}
          </div>
        </div>

        {/* Meta badges */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <MetaBadge
            color="blue"
            icon={<BookOpen className="h-3 w-3" />}
            label={`${className} • ${subjectName}`}
          />
          <MetaBadge
            color="gray"
            icon={<MessageSquare className="h-3 w-3" />}
            label={`${totalQuestions} questions`}
          />
          <MetaBadge
            color="amber"
            icon={<Star className="h-3 w-3" />}
            label={`${totalMarks} marks`}
          />
          <MetaBadge
            color="purple"
            icon={<Clock className="h-3 w-3" />}
            label={`${assessment?.durationMinutes} minutes`}
          />
          {assessment?.assessmentMapping && (
            <MetaBadge
              color="green"
              icon={<Tag className="h-3 w-3" />}
              label={assessment?.assessmentMapping}
            />
          )}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {localSections
            ?.sort((a, b) => a?.sectionOrder - b?.sectionOrder)
            ?.map((section, sIdx) => (
              <SectionCard
                key={section?.id}
                section={section}
                startIndex={sectionStartIndices[sIdx]}
                onReorder={(ids) => handleReorder(section?.id, ids)}
                onRemoveQuestion={handleRemoveQuestion}
                onAddFromBank={() =>
                  setSelectFromBankOpen({ sectionId: section?.id })
                }
                onDeleteSection={() => handleDeleteSection(section?.id)}
              />
            ))}
        </div>

        {/* Add section */}
        <button
          onClick={handleAddSection}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3.5 text-sm text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add New Section
        </button>
      </div>

      {/* Select from question bank modal */}
      {selectFromBankOpen && (
        <SelectFromQuestionBankModal
          open={true}
          classId={classId}
          subjectId={subjectId}
          alreadySelectedIds={alreadySelectedIds}
          onClose={() => setSelectFromBankOpen(null)}
          onAdd={(questionIds) => {
            handleAddFromBank(selectFromBankOpen?.sectionId, questionIds);
            setSelectFromBankOpen(null);
          }}
        />
      )}
    </>
  );
};

// ─── Meta badge ───────────────────────────────────────────────────────────────

const MetaBadge = ({
  color,
  icon,
  label,
}: {
  color: string;
  icon: React.ReactNode;
  label: string;
}) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-50   text-blue-700   border-blue-200",
    gray: "bg-gray-100  text-gray-700   border-gray-200",
    amber: "bg-amber-50  text-amber-700  border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50  text-green-700  border-green-200",
  };
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
        colors[color] || colors?.gray,
      )}
    >
      {icon}
      {label}
    </span>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  section: ApiSection;
  startIndex: number;
  onReorder: (ids: number[]) => void;
  onRemoveQuestion: (assessmentQuestionId: number) => void;
  onAddFromBank: () => void;
  onDeleteSection: () => void;
}

const SectionCard = ({
  section,
  startIndex,
  onReorder,
  onRemoveQuestion,
  onAddFromBank,
  onDeleteSection,
}: SectionCardProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const questionDetailResults = useQueries({
    queries: (section?.questions ?? []).map((q) => ({
      queryKey: questionBankKeys.questionDetail(q.questionId),
      queryFn: () => getCbtQuestion(q.questionId),
      staleTime: 1000 * 60 * 5,
      enabled: !!q.questionId,
    })),
  });

  const questionDetailMap = new Map<number, ApiQuestion>(
    questionDetailResults
      .filter((r) => !!r.data?.data)
      .map((r) => [r.data!.data.id, r.data!.data]),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = section?.questions?.map((q) => q?.assessmentQuestionId);
    const oldIdx = ids.indexOf(active.id as number);
    const newIdx = ids.indexOf(over.id as number);
    onReorder(arrayMove(ids, oldIdx, newIdx));
  };

  const sortableIds = section?.questions?.map((q) => q?.assessmentQuestionId);
  console.log({ section });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-gray-900">
            {section?.name}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {section?.instructions || "Instructions (optional)"}
          </p>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <button
            onClick={onDeleteSection}
            className="text-gray-300 transition-colors hover:text-red-400"
            title="Delete section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="text-gray-400 transition-colors hover:text-gray-600"
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
        <div className="px-5 py-4">
          {/* Action buttons */}
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={onAddFromBank}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Question
            </button>
            <button
              onClick={onAddFromBank}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Add from Question Bank
            </button>
          </div>

          {/* Questions */}
          {section?.questions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center">
              <p className="mb-1 text-sm text-gray-500">No questions yet</p>
              <p className="mb-3 text-xs text-gray-400">
                Add question to get started
              </p>
              <button
                onClick={onAddFromBank}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-1.5 text-sm transition-colors hover:bg-gray-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Question
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {sortableIds && (
                <SortableContext
                  items={sortableIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {section?.questions &&
                      section?.questions?.map((q, idx) => (
                        <SortableAssessmentQuestion
                          key={q?.assessmentQuestionId}
                          question={q}
                          fullQuestion={questionDetailMap.get(q?.questionId)}
                          number={startIndex + idx + 1}
                          onRemove={() =>
                            onRemoveQuestion(q?.assessmentQuestionId)
                          }
                        />
                      ))}
                  </div>
                </SortableContext>
              )}
            </DndContext>
          )}

          {section?.questions?.length > 0 && (
            <button
              onClick={onAddFromBank}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Add from Question Bank
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Sortable question row ────────────────────────────────────────────────────

const SortableAssessmentQuestion = ({
  question,
  fullQuestion,
  number,
  onRemove,
}: {
  question: ApiAssessmentQuestion;
  fullQuestion?: ApiQuestion;
  number: number;
  onRemove: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question?.assessmentQuestionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const displayType = toDisplayType(question?.questionType as string);

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
          className="shrink-0 cursor-grab text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:text-gray-500 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="w-8 shrink-0 text-xs font-semibold text-gray-400">
          Q{number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-800">
            {fullQuestion?.questionText ?? question?.questionText}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-xs",
                getQuestionTypeBadgeColor(displayType),
              )}
            >
              {getQuestionTypeLabel(displayType)}
            </span>
            <span className="text-xs text-gray-400">
              • {question?.marks} mark{question?.marks !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

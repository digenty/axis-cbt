"use client";

import { use, useMemo, useState } from "react";
import {
  BookOpen,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/PageHeader";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { QuestionBankModal } from "@/components/assessments/QuestionBankModal";
import { AddAssessmentItemModal } from "@/components/question-bank/AddAssessmentItemModal";
import { QuestionEditForm } from "@/components/question-bank/QuestionEditForm";
import {
  apiQuestionToUI,
  questionToCreatePayload,
} from "@/types/question.mapper";
import {
  addMinutes,
  composeStartDateTime,
  splitStartDateTime,
  uiTermToApi,
  uiTestTypeToApi,
} from "@/types/assessment.mapper";
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
  usePublishAssessment,
  useRemoveQuestionFromSection,
  useUpdateAssessment,
  useUpdateSection,
} from "@/hooks/queryHooks/useAssessment";
import {
  useDuplicateCbtQuestion,
  useGetQuestions,
  useGetTopics,
  useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import type { ApiSection } from "@/types/question";
import type { Question, QuestionType, TermType, TestType } from "@/types";
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
    () => section.questions.map((q) => String(q.questionId)),
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const name = window.prompt("Section name", section.name);
              if (name?.trim()) onRenameSection(name.trim());
            }}
            className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-default-subtle)]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection();
            }}
            disabled={busy}
            className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
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
              {section.questions.map((aq, i) => {
                const isExpanded = expandedIds.has(aq.assessmentQuestionId);
                const fullQuestion = bankQuestions.find(
                  (q) => Number(q.id) === aq.questionId,
                );
                return (
                  <div
                    key={aq.assessmentQuestionId}
                    className={cn(
                      "rounded-lg border transition-colors hover:bg-[var(--color-bg-state-soft)]",
                      isExpanded
                        ? "border-blue-500 ring-1 ring-blue-500/20"
                        : "border-[var(--color-border-default)]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleExpand(aq.assessmentQuestionId)}
                      className="flex w-full items-center gap-2 px-3 py-4.5 text-left"
                    >
                      <GripVertical className="h-3.5 w-3.5 shrink-0 text-[var(--color-icon-default-muted)]" />
                      <span className="shrink-0 rounded bg-[var(--color-bg-badge-gray)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-text-subtle)]">
                        Q{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-[var(--color-text-default)]">
                          {aq.questionText || "(untitled)"}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          {fullQuestion ? (
                            <QuestionTypeBadge type={fullQuestion.type} />
                          ) : null}
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

                    {isExpanded && fullQuestion && (
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
                          onDuplicateQuestion(
                            Number(fullQuestion.id),
                            section.id,
                          )
                        }
                        onDelete={() =>
                          onRemoveQuestion(aq.assessmentQuestionId)
                        }
                      />
                    )}
                  </div>
                );
              })}
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
  const [titleDraft, setTitleDraft] = useState<string | null>(null);
  const [editingDetails, setEditingDetails] = useState(false);

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

  const startSplit = splitStartDateTime(assessment.startDateTime);

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
        assessmentMapping: assessment.assessmentMapping,
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

  // Map UI term/type labels for the selects
  const uiTerm: TermType =
    assessment.term === "FIRST"
      ? "First Term"
      : assessment.term === "SECOND"
        ? "Second Term"
        : "Third Term";
  const uiTestType: TestType =
    assessment.testType === "EXAMINATION"
      ? "Examination"
      : "Continuous Assessment";

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingDetails((v) => !v)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Edit Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingDetails((v) => !v)}
            >
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
        {assessment.assessmentMapping && (
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-green)] px-2 py-1 h-7 border border-bg-basic-green-accent text-[11px] text-[var(--green-700)]">
            <Tag className="h-3 w-3" />
            {assessment.assessmentMapping}
          </span>
        )}
      </div>

      {editingDetails && (
        <div className="mt-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Test type</Label>
              <select
                value={uiTestType}
                onChange={(e) =>
                  patchAssessment({
                    testType: uiTestTypeToApi(e.target.value as TestType),
                  })
                }
                className="h-9 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm focus:outline-none"
              >
                <option>Continuous Assessment</option>
                <option>Examination</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Term</Label>
              <select
                value={uiTerm}
                onChange={(e) =>
                  patchAssessment({
                    term: uiTermToApi(e.target.value as TermType),
                  })
                }
                className="h-9 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm focus:outline-none"
              >
                <option>First Term</option>
                <option>Second Term</option>
                <option>Third Term</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mapping</Label>
              <Input
                value={assessment.assessmentMapping}
                onChange={(e) =>
                  patchAssessment({ assessmentMapping: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Duration (minutes)</Label>
              <Input
                type="number"
                value={assessment.durationMinutes}
                onChange={(e) => {
                  const minutes = Number(e.target.value) || 0;
                  patchAssessment({
                    durationMinutes: minutes,
                    endDateTime: addMinutes(assessment.startDateTime, minutes),
                  });
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Test date</Label>
              <Input
                type="date"
                value={startSplit.testDate}
                onChange={(e) => {
                  const newStart = composeStartDateTime({
                    testDate: e.target.value,
                    startHour: startSplit.startHour,
                    startMinute: startSplit.startMinute,
                    amPm: startSplit.amPm,
                  });
                  patchAssessment({
                    startDateTime: newStart,
                    endDateTime: addMinutes(
                      newStart,
                      assessment.durationMinutes,
                    ),
                  });
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Start time (24h)</Label>
              <Input
                type="time"
                value={`${startSplit.amPm === "PM" && Number(startSplit.startHour) !== 12 ? Number(startSplit.startHour) + 12 : startSplit.amPm === "AM" && Number(startSplit.startHour) === 12 ? 0 : Number(startSplit.startHour)}:${startSplit.startMinute}`}
                onChange={(e) => {
                  const [hh, mm] = e.target.value.split(":");
                  const h24 = Number(hh);
                  const newStart = composeStartDateTime({
                    testDate: startSplit.testDate,
                    startHour: String(h24 % 12 === 0 ? 12 : h24 % 12).padStart(
                      2,
                      "0",
                    ),
                    startMinute: mm,
                    amPm: h24 >= 12 ? "PM" : "AM",
                  });
                  patchAssessment({
                    startDateTime: newStart,
                    endDateTime: addMinutes(
                      newStart,
                      assessment.durationMinutes,
                    ),
                  });
                }}
              />
            </div>
          </div>
          {branchId === undefined && (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Branch is being resolved…
            </p>
          )}
        </div>
      )}

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
            onDeleteSection={() =>
              deleteSectionMutation.mutate(section.id, {
                onSuccess: () => toast.success("Section deleted"),
                onError: () => toast.error("Failed to delete section"),
              })
            }
            onAddFromBank={(ids) =>
              addQuestionsToSectionMutation.mutate(
                { sectionId: section.id, questionIds: ids },
                {
                  onSuccess: () => toast.success("Questions added"),
                  onError: () => toast.error("Failed to add questions"),
                },
              )
            }
            onRemoveQuestion={(aqId) =>
              removeQuestionMutation.mutate(aqId, {
                onSuccess: () => toast.success("Question removed"),
                onError: () => toast.error("Failed to remove question"),
              })
            }
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
    </div>
  );
};

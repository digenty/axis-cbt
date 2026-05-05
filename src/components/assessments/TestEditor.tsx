"use client";

import { use, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Cloud,
  FileText,
  GripVertical,
  Pencil,
  Plus,
  Star,
  Tag,
  Timer,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCBTStore } from "@/store";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/PageHeader";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Switch } from "@/components/ui/switch";
import { QuestionBankModal } from "@/components/assessments/QuestionBankModal";
import { AddAssessmentItemModal } from "@/components/question-bank/AddAssessmentItemModal";
import { QuestionEditForm } from "@/components/question-bank/QuestionEditForm";
import type { Question, QuestionType, Test, TestSection, Topic } from "@/types";
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

const SectionPanel = ({
  section,
  onUpdate,
  onDelete,
  onAddFromBank,
  onAddQuestion,
  allQuestions,
  subjectName,
  subjectTopics,
}: {
  section: TestSection;
  onUpdate: (s: TestSection) => void;
  onDelete: () => void;
  onAddFromBank: (questionIds: string[]) => void;
  onAddQuestion: (type: QuestionType, materialKind?: string) => void;
  allQuestions: Question[];
  subjectName: string;
  subjectTopics: Topic[];
}) => {
  const { updateQuestion, duplicateQuestion } = useCBTStore();
  const [open, setOpen] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const questions = section.questionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean) as typeof allQuestions;

  return (
    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
      >
        <div className="flex flex-col items-start text-left">
          <span className="text-lg font-semibold text-[var(--color-text-default)]">
            {section.title}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            Instructions{" "}
            <span className="text-[var(--color-text-muted)]">(optional)</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const name = window.prompt("Section name", section.title);
              if (name?.trim()) onUpdate({ ...section, title: name.trim() });
            }}
            className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-default-subtle)]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
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

          {questions.length === 0 ? (
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
              {questions.map((q, i) => {
                const isExpanded = expandedIds.has(q.id);
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "rounded-lg border transition-colors hover:bg-[var(--color-bg-state-soft)]",
                      isExpanded
                        ? "border-blue-500 ring-1 ring-blue-500/20"
                        : "border-[var(--color-border-default)]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="flex w-full items-center gap-2 px-3 py-4.5 text-left"
                    >
                      <GripVertical className="h-3.5 w-3.5 shrink-0 text-[var(--color-icon-default-muted)]" />
                      <span className="shrink-0 rounded bg-[var(--color-bg-badge-gray)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-text-subtle)]">
                        Q{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-[var(--color-text-default)]">
                          {q.text || "(untitled)"}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <QuestionTypeBadge type={q.type} />
                          <span className="text-[11px] text-[var(--color-text-muted)]">
                            • {q.marks} mark{q.marks === 1 ? "" : "s"}
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

                    {isExpanded && (
                      <QuestionEditForm
                        question={q}
                        onUpdate={(updated) =>
                          updateQuestion(updated.id, updated)
                        }
                        onDuplicate={() => duplicateQuestion(q.id)}
                        onDelete={() =>
                          onUpdate({
                            ...section,
                            questionIds: section.questionIds.filter(
                              (id) => id !== q.id,
                            ),
                          })
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
        questions={allQuestions}
        alreadyAddedIds={section.questionIds}
        topics={subjectTopics}
        onAdd={(ids) => onAddFromBank(ids)}
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

export const TestEditor = ({ params }: TestEditorProps) => {
  const { classId, subjectId, assessmentId } = use(params);
  const router = useRouter();
  const { tests, subjects, classes, questions, topics, updateTest } =
    useCBTStore();

  const test = useMemo(
    () => tests.find((t) => t.id === assessmentId),
    [tests, assessmentId],
  );
  const subject = useMemo(
    () => subjects.find((s) => s.id === subjectId),
    [subjects, subjectId],
  );
  const cls = useMemo(
    () => classes.find((c) => c.id === classId),
    [classes, classId],
  );
  const subjectQuestions = useMemo(
    () =>
      questions.filter((q) => {
        const t = subject?.topics ?? [];
        return t.some((topic) => topic.id === String(q.topicId));
      }),
    [questions, subject],
  );
  const subjectTopics = useMemo(
    () => topics.filter((t) => String(t.subjectId) === String(subjectId)),
    [topics, subjectId],
  );

  // Fall back to all questions tied to topics that belong to this subject id
  const subjectQuestionsFinal = useMemo(
    () =>
      subjectQuestions.length > 0
        ? subjectQuestions
        : questions.filter((q) =>
            useCBTStore
              .getState()
              .topics.filter((t) => String(t.subjectId) === String(subjectId))
              .some((t) => String(q.topicId) === String(t.id)),
          ),
    [subjectQuestions, questions, subjectId],
  );

  const [editingDetails, setEditingDetails] = useState(false);

  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

  if (!test || !subject || !cls) {
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

  const totalMarks = test.sections
    .flatMap((s) => s.questionIds)
    .map((id) => questions.find((q) => q.id === id)?.marks ?? 0)
    .reduce((a, b) => a + b, 0);

  const updateSection = (sectionId: string, next: TestSection) => {
    updateTest(test.id, {
      sections: test.sections.map((s) => (s.id === sectionId ? next : s)),
      totalMarks: test.sections
        .map((s) => (s.id === sectionId ? next : s))
        .flatMap((s) => s.questionIds)
        .map((id) => questions.find((q) => q.id === id)?.marks ?? 0)
        .reduce((a, b) => a + b, 0),
    });
  };

  const deleteSection = (sectionId: string) => {
    updateTest(test.id, {
      sections: test.sections.filter((s) => s.id !== sectionId),
    });
  };

  const addSection = () => {
    const letter = String.fromCharCode(65 + test.sections.length);
    updateTest(test.id, {
      sections: [
        ...test.sections,
        {
          id: generateId(),
          title: `Section ${letter}`,
          instruction: "",
          questionIds: [],
        },
      ],
    });
  };

  const handlePublish = () => {
    updateTest(test.id, { status: "published" });
    toast.success("Test published");
  };

  const handleAddQuestion = (
    type: QuestionType,
    materialKind?: string,
    sectionId?: string,
  ) => {
    const searchParams = new URLSearchParams({ type });
    if (materialKind) searchParams.set("materialKind", materialKind);
    searchParams.set("returnTo", `${baseUrl}/assessments/${assessmentId}`);
    searchParams.set("assessmentId", assessmentId);
    if (sectionId) searchParams.set("sectionId", sectionId);
    router.push(`${baseUrl}/question-bank/new?${searchParams}`);
  };

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title={
          <input
            value={test.title}
            onChange={(e) => updateTest(test.id, { title: e.target.value })}
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
            <Button size="sm" onClick={handlePublish}>
              <Cloud className="mr-1 h-3.5 w-3.5" />
              Publish Test
            </Button>
          </>
        }
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-blue)] px-2 py-1 text-[11px] h-7 border border-bg-basic-blue-accent text-[var(--blue-700)]">
          <BookOpen className="h-3 w-3 text-bg-basic-blue-accent" />
          {cls.name.replace(" ", "")} • {subject.name}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-gray)] px-2 py-1 h-7 border border-bg-basic-gray-accent text-[11px] text-[var(--color-text-subtle)]">
          <FileText className="h-3 w-3" />
          {test.sections.reduce((n, s) => n + s.questionIds.length, 0)}{" "}
          questions
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-amber)] px-2 py-1 h-7 border border-bg-basic-amber-accent text-[11px] text-[var(--amber-700)]">
          <Star className="h-3 w-3" />
          {totalMarks} marks
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-purple)] px-2 py-1 h-7 border border-bg-basic-purple-accent text-[11px] text-[var(--purple-700)]">
          <Timer className="h-3 w-3" />
          {test.duration} minutes
        </span>
        {test.mappingLabel && (
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-badge-green)] px-2 py-1 h-7 border border-bg-basic-green-accent text-[11px] text-[var(--green-700)]">
            <Tag className="h-3 w-3" />
            {test.mappingLabel}
          </span>
        )}
      </div>

      {editingDetails && (
        <div className="mt-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Test type</Label>
              <select
                value={test.testType}
                onChange={(e) =>
                  updateTest(test.id, {
                    testType: e.target.value as Test["testType"],
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
                value={test.term}
                onChange={(e) =>
                  updateTest(test.id, {
                    term: e.target.value as Test["term"],
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
              <select
                value={test.assessmentMapping || ""}
                onChange={(e) => {
                  const v = e.target.value as Test["assessmentMapping"];
                  const label =
                    v === "Continuous Assessment 1 (20%)"
                      ? "CA 1"
                      : v === "Continuous Assessment 2 (20%)"
                        ? "CA 2"
                        : v === "Examination (60%)"
                          ? "Exam"
                          : "";
                  updateTest(test.id, {
                    assessmentMapping: v,
                    mappingLabel: label,
                  });
                }}
                className="h-9 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm focus:outline-none"
              >
                <option value="">None ( Manual Scoring)</option>
                <option>Continuous Assessment 1 (20%)</option>
                <option>Continuous Assessment 2 (20%)</option>
                <option>Examination (60%)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Duration (minutes)</Label>
              <Input
                type="number"
                value={test.duration}
                onChange={(e) =>
                  updateTest(test.id, {
                    duration: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Test date</Label>
              <Input
                type="date"
                value={test.testDate}
                onChange={(e) =>
                  updateTest(test.id, { testDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Start time</Label>
              <Input
                type="time"
                value={test.startTime}
                onChange={(e) =>
                  updateTest(test.id, { startTime: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {test.sections.map((section) => (
          <SectionPanel
            key={section.id}
            section={section}
            subjectName={subject.name}
            subjectTopics={subjectTopics}
            allQuestions={subjectQuestionsFinal}
            onUpdate={(s) => updateSection(section.id, s)}
            onDelete={() => deleteSection(section.id)}
            onAddFromBank={(ids) => {
              const next = {
                ...section,
                questionIds: Array.from(
                  new Set([...section.questionIds, ...ids]),
                ),
              };
              updateSection(section.id, next);
            }}
            onAddQuestion={(type, materialKind) =>
              handleAddQuestion(type, materialKind, section.id)
            }
          />
        ))}

        <button
          type="button"
          onClick={addSection}
          className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-card)] py-3 text-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New Section
        </button>
      </div>

      {/* <div className="mt-5 flex items-center gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
        <Switch
          id="result-access"
          checked={test.studentResultAccess}
          onCheckedChange={(checked: boolean) =>
            updateTest(test.id, { studentResultAccess: checked })
          }
        />
        <label
          htmlFor="result-access"
          className="text-sm text-[var(--color-text-default)]"
        >
          Allow students to see their result after submission
        </label>
      </div> */}
    </div>
  );
};

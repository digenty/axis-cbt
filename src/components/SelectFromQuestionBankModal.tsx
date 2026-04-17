"use client";

import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getQuestionTypeBadge, getQuestionTypeLabel } from "@/utils/question";
import { Modal } from "@/components/Modal";
import {
  useGetQuestions,
  useGetTopics,
} from "@/hooks/queryHooks/useQuestionBank";
import type { ApiQuestion, ApiTopic, QuestionType } from "@/types/question";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SelectFromQuestionBankModalProps {
  open: boolean;
  classId: number;
  subjectId: number;
  /** IDs already added to the assessment — these rows are disabled */
  alreadySelectedIds: number[];
  onClose: () => void;
  onAdd: (questions: ApiQuestion[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SelectFromQuestionBankModal = ({
  open,
  classId,
  subjectId,
  alreadySelectedIds,
  onClose,
  onAdd,
}: SelectFromQuestionBankModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // ── Data ──────────────────────────────────────────────────────────────────

  const { data: topicsResponse } = useGetTopics({ classId, subjectId });
  const topics: ApiTopic[] = topicsResponse?.data ?? [];

  const { data: questionsResponse, isLoading } = useGetQuestions({
    classId,
    subjectId,
  });

  const allQuestions: ApiQuestion[] = useMemo(
    () => questionsResponse?.data ?? [],
    [questionsResponse?.data],
  );

  // Active topic — falls back to the first topic
  const activeTopicId = selectedTopicId ?? topics[0]?.id ?? null;

  // Filter by topic then by search
  const visibleQuestions = useMemo(() => {
    const questions = questionsResponse?.data ?? [];

    const base = activeTopicId
      ? questions.filter((q) => q.topicId === activeTopicId)
      : questions;

    if (!search.trim()) return base;

    return base.filter((q) =>
      q.questionText.toLowerCase().includes(search.toLowerCase()),
    );
  }, [activeTopicId, search, questionsResponse?.data]);

  // ── Selection helpers ─────────────────────────────────────────────────────

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAdd = () => {
    const selected = allQuestions.filter((q) => selectedIds.has(q.id));
    onAdd(selected);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const reset = () => {
    setSelectedIds(new Set());
    setSearch("");
    setSelectedTopicId(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Select from Question Bank"
      subtitle={
        selectedIds.size > 0
          ? `${selectedIds.size} question${selectedIds.size !== 1 ? "s" : ""} selected`
          : "Select questions to add to the assessment"
      }
      className="max-h-[90vh] overflow-y-auto"
      footer={
        <div className="flex items-center justify-between px-5 pb-5">
          <button
            onClick={handleClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedIds.size === 0}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              selectedIds.size > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-100 text-gray-400",
            )}
          >
            Add Questions
            {selectedIds.size > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
                {selectedIds.size}
              </span>
            )}
          </button>
        </div>
      }
    >
      <div className="flex flex-col">
        {/* Search */}
        <div className="border-b border-gray-100 px-5 pt-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions"
              className="h-9 w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Topic tabs */}
        {topics.length > 0 && (
          <div className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-gray-100 px-5 py-3">
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTopicId(t.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  activeTopicId === t.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}

        {/* Question list */}
        <div className="max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            </div>
          ) : visibleQuestions.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              {search
                ? `No questions matching "${search}"`
                : "No questions found"}
            </div>
          ) : (
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {visibleQuestions.map((q) => {
                  const isAlready = alreadySelectedIds.includes(q.id);
                  const isSelected = selectedIds.has(q.id);
                  const qType = q.questionType as QuestionType;

                  return (
                    <tr
                      key={q.id}
                      className={cn(
                        "transition-colors",
                        isAlready
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer hover:bg-gray-50",
                      )}
                      onClick={() => !isAlready && toggleSelect(q.id)}
                    >
                      {/* Checkbox */}
                      <td className="w-10 py-3.5 pr-3 pl-5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isAlready}
                          onChange={() => !isAlready && toggleSelect(q.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 cursor-pointer accent-blue-600"
                        />
                      </td>

                      {/* Type badge */}
                      <td className="w-40 py-3.5 pr-4">
                        <span
                          className={cn(
                            "rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                            getQuestionTypeBadge(qType),
                          )}
                        >
                          {getQuestionTypeLabel(qType)}
                        </span>
                      </td>

                      {/* Question text */}
                      <td className="py-3.5 pr-4">
                        <p className="line-clamp-1 text-sm text-gray-800">
                          {q.questionText}
                        </p>
                        {q.difficultyLevel && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {q.difficultyLevel}
                          </p>
                        )}
                      </td>

                      {/* Marks */}
                      <td className="py-3.5 pr-3 text-right whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {q.marks} mark{q.marks !== 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Preview (stub — wire to a preview modal later) */}
                      <td className="w-10 py-3.5 pr-5">
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 transition-colors hover:text-gray-600"
                          title="Preview question"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
};

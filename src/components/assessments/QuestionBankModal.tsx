"use client";

import { useState, useMemo } from "react";
import { Eye, Search } from "lucide-react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { cn } from "@/lib/utils";
import type { Question, Topic } from "@/types";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  questions: Question[];
  alreadyAddedIds: string[];
  topics: Topic[];
  onAdd: (questionIds: string[]) => void;
}

export const QuestionBankModal = ({
  open,
  setOpen,
  questions,
  alreadyAddedIds,
  topics,
  onAdd,
}: Props) => {
  const isMobile = useIsMobile();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let qs = questions;
    if (activeTopicId) {
      qs = qs.filter((q) => String(q.topicId) === activeTopicId);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      qs = qs.filter((q) => q.text?.toLowerCase().includes(s));
    }
    return qs;
  }, [questions, activeTopicId, search]);

  const handleClose = () => {
    setSelectedIds([]);
    setSearch("");
    setActiveTopicId(null);
    setOpen(false);
  };

  const handleAdd = () => {
    onAdd(selectedIds);
    handleClose();
  };

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const content = (
    <div className="flex flex-col">
      <div className="px-4 pt-3 pb-2">
        <p className="text-xs text-[var(--color-text-muted)]">
          {selectedIds.length} question{selectedIds.length === 1 ? "" : "s"}{" "}
          selected
        </p>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-default-muted)]" />
          <Input
            placeholder="Search questions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Topic filter tabs */}
      {topics.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {topics.map((t) => {
            const active = activeTopicId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTopicId(active ? null : t.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-sm transition-colors",
                  active
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-[var(--color-border-default)] text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]",
                )}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Question list */}
      <div className="max-h-[50vh] divide-y divide-[var(--color-border-default)] overflow-y-auto border-t border-[var(--color-border-default)]">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
            No questions found
          </p>
        ) : (
          filtered.map((q) => {
            const alreadyAdded = alreadyAddedIds.includes(q.id);
            const checked = selectedIds.includes(q.id) || alreadyAdded;
            return (
              <div
                key={q.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-4.5",
                  alreadyAdded
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-[var(--color-bg-state-soft-hover)]",
                )}
                onClick={() => !alreadyAdded && toggle(q.id)}
              >
                <Checkbox
                  checked={checked}
                  disabled={alreadyAdded}
                  onCheckedChange={() => !alreadyAdded && toggle(q.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="w-28 shrink-0">
                  <QuestionTypeBadge type={q.type} />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm text-[var(--color-text-default)]">
                  {q.text || "(untitled)"}
                </p>
                <span className="shrink-0 whitespace-nowrap text-xs text-[var(--color-text-muted)]">
                  {q.marks} mark{q.marks === 1 ? "" : "s"}
                </span>
                <Eye className="h-4 w-4 shrink-0 text-[var(--color-icon-default-muted)]" />
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--color-border-default)] p-4">
        <Button variant="outline" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={selectedIds.length === 0}
          onClick={handleAdd}
        >
          Add Questions
          {selectedIds.length > 0 && (
            <span className="ml-1.5 rounded bg-white/25 px-1.5 py-0.5 text-xs font-semibold">
              {selectedIds.length}
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {!isMobile && (
        <Modal
          open={open}
          setOpen={handleClose}
          title="Select from Question Bank"
          showFooter={false}
          className="sm:max-w-232"
        >
          {content}
        </Modal>
      )}
      {isMobile && (
        <MobileDrawer
          open={open}
          setIsOpen={handleClose}
          title="Select from Question Bank"
        >
          {content}
        </MobileDrawer>
      )}
    </>
  );
};

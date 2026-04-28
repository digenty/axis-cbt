"use client";

import { useMemo, useState } from "react";
import { Plus, Lightbulb } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";
import { QuestionRow } from "./QuestionRow";
import type { Question, Topic } from "@/types";

interface QuestionListPanelProps {
  topic: Topic | null;
  questions: Question[];
  onAddQuestion: () => void;
  onEditQuestion: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

const Sortable = ({
  question,
  index,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  question: Question;
  index: number;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <QuestionRow
        index={index}
        question={question}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        dragHandleProps={
          {
            ...attributes,
            ...listeners,
          } as unknown as React.HTMLAttributes<HTMLButtonElement>
        }
      />
    </div>
  );
};

export const QuestionListPanel = ({
  topic,
  questions,
  onAddQuestion,
  onEditQuestion,
  onDuplicate,
  onDelete,
  onReorder,
}: QuestionListPanelProps) => {
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((qu) => qu.text.toLowerCase().includes(q));
  }, [questions, search]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = questions.map((q) => q.id);
    const oldIdx = ids.indexOf(String(active.id));
    const newIdx = ids.indexOf(String(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    onReorder(arrayMove(ids, oldIdx, newIdx));
  };

  if (!topic) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <EmptyState
          icon={<Lightbulb className="h-8 w-8" />}
          title="Select a topic"
          description="Pick a topic on the left to view its questions."
        />
      </div>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-[var(--color-bg-default)]">
      <header className="border-b border-[var(--color-border-default)] px-5 py-4">
        <h1 className="text-base font-semibold text-[var(--color-text-default)]">
          {topic.name}
        </h1>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border-default)] px-5 py-3">
        <div className="min-w-0 flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search questions"
          />
        </div>
        <Button onClick={onAddQuestion} className="h-9">
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add question
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Lightbulb className="h-8 w-8" />}
            title="No questions yet"
            description="Questions added under this topic will appear here"
            action={
              <Button variant="outline" size="sm" onClick={onAddQuestion}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Question
              </Button>
            }
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filtered.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {filtered.map((q, i) => (
                  <Sortable
                    key={q.id}
                    question={q}
                    index={i}
                    onEdit={() => onEditQuestion(q.id)}
                    onDuplicate={() => onDuplicate(q.id)}
                    onDelete={() => onDelete(q.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {filtered.length > 0 && (
          <button
            type="button"
            onClick={onAddQuestion}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--color-border-strong)] py-2.5 text-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </button>
        )}
      </div>
    </section>
  );
};

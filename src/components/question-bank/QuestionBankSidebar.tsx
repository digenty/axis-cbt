"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Upload, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/common/BackButton";
import type { Topic } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionBankSidebarProps {
  subjectTitle: string;
  subtitle: string;
  topics: Topic[];
  activeTopicId: string | null;
  onSelectTopic: (id: string) => void;
  onAddTopic: (name: string) => void;
  onRenameTopic: (id: string, name: string) => void;
  onDeleteTopic: (id: string) => void;
  onReorderTopics: (orderedIds: string[]) => void;
  importHref: string;
  backHref: string;
}

const SortableTopicRow = ({
  topic,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  topic: Topic;
  active: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: topic.id });
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(topic.name);

  const commit = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== topic.name) onRename(trimmed);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-2 text-sm",
        active
          ? "bg-[var(--color-bg-state-soft)] text-[var(--color-text-default)]"
          : "text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)] hover:text-[var(--color-text-default)]",
      )}
    >
      <button
        type="button"
        className="flex h-5 w-3 shrink-0 cursor-grab items-center justify-center text-[var(--color-icon-default-muted)] active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {editing ? (
        <Input
          autoFocus
          className="h-7 px-2 text-sm"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraftName(topic.name);
              setEditing(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="flex-1 truncate text-left"
        >
          {topic.name}
        </button>
      )}
      {!editing && (
        <div className="hidden items-center gap-0.5 group-hover:flex">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-state-soft-press)]"
            aria-label="Rename topic"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-icon-destructive)] hover:bg-[var(--color-bg-badge-red)]"
            aria-label="Delete topic"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export const QuestionBankSidebar = ({
  subjectTitle,
  subtitle,
  topics,
  activeTopicId,
  onSelectTopic,
  onAddTopic,
  onRenameTopic,
  onDeleteTopic,
  onReorderTopics,
  importHref,
  backHref,
}: QuestionBankSidebarProps) => {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = topics.map((t) => t.id);
    const oldIdx = ids.indexOf(String(active.id));
    const newIdx = ids.indexOf(String(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    onReorderTopics(arrayMove(ids, oldIdx, newIdx));
  };

  const commitNew = () => {
    const trimmed = draft.trim();
    if (trimmed) onAddTopic(trimmed);
    setDraft("");
    setAdding(false);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-[var(--color-border-default)] bg-[var(--color-bg-card)] md:w-[280px]">
      <div className="border-b border-[var(--color-border-default)] p-4">
        <BackButton href={backHref} />
        <div className="mt-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-default)]">
            {subjectTitle}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
        </div>
        <Button
          asChild
          variant="outline"
          className="mt-3 w-full justify-center"
        >
          <Link href={importHref}>
            <Upload className="mr-2 h-3.5 w-3.5" />
            Import questions
          </Link>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={topics.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {topics.map((topic) => (
              <SortableTopicRow
                key={topic.id}
                topic={topic}
                active={topic.id === activeTopicId}
                onSelect={() => onSelectTopic(topic.id)}
                onRename={(name) => onRenameTopic(topic.id, name)}
                onDelete={() => onDeleteTopic(topic.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {adding ? (
          <div className="mt-2 flex items-center gap-2">
            <Input
              autoFocus
              className="h-8"
              placeholder="Topic name"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitNew}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitNew();
                if (e.key === "Escape") {
                  setDraft("");
                  setAdding(false);
                }
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--color-border-strong)] py-2 text-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Topic
          </button>
        )}
      </div>
    </aside>
  );
};

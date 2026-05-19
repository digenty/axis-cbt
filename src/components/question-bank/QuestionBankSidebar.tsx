"use client";

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
import {
  GripVertical,
  Plus,
  Upload,
  Trash2,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/common/BackButton";
import type { Topic } from "@/types";
import { cn } from "@/lib/utils";
import { Import } from "@digenty/icons";
import { useRouter } from "next/navigation";

interface QuestionBankSidebarProps {
  subjectTitle: string;
  subtitle: string;
  topics: Topic[];
  activeTopicId: string | null;
  onSelectTopic: (id: string) => void;
  onRequestAddTopic: () => void;
  onRequestRenameTopic: (topic: Topic) => void;
  onRequestDeleteTopic: (topic: Topic) => void;
  onReorderTopics: (orderedIds: string[]) => void;
  importHref: string;
}

const SortableTopicRow = ({
  topic,
  active,
  onSelect,
  onRequestRename,
  onRequestDelete,
}: {
  topic: Topic;
  active: boolean;
  onSelect: () => void;
  onRequestRename: () => void;
  onRequestDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: topic.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-2 text-sm h-8",
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
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 truncate text-left"
      >
        {topic.name}
      </button>
      <div className="hidden items-center gap-0.5 group-hover:flex">
        <button
          type="button"
          onClick={onRequestRename}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-state-soft-press)]"
          aria-label="Rename topic"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRequestDelete}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-icon-destructive)] hover:bg-[var(--color-bg-badge-red)]"
          aria-label="Delete topic"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export const QuestionBankSidebar = ({
  subjectTitle,
  subtitle,
  topics,
  activeTopicId,
  onSelectTopic,
  onRequestAddTopic,
  onRequestRenameTopic,
  onRequestDeleteTopic,
  onReorderTopics,
  importHref,
}: QuestionBankSidebarProps) => {
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

  const router = useRouter();

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-[var(--color-border-default)] bg-[var(--color-bg-card)] md:w-[280px]">
      <div className="border-b border-[var(--color-border-default)] py-3.5">
        <div className="px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-8 border-none bg-transparent gap-1.5 px-2.5 text-xs font-medium text-[var(--color-text-subtle)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
        </div>
        <div className="mt-3 border-b border-border-default pb-3.5">
          <h2 className="text-base font-medium text-[var(--color-text-default)] px-4">
            {subjectTitle}
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-muted)] px-4">
            {subtitle}
          </p>
        </div>

        <div className="px-4">
          <Button
            asChild
            variant="outline"
            className="mt-3.5 w-full justify-center"
          >
            <Link href={importHref}>
              <Import
                fill="var(--color-icon-default-muted)"
                className="size-3.5"
              />
              Import questions
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto py-3.5">
        <div className="flex flex-col gap-2 px-4">
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
                  onRequestRename={() => onRequestRenameTopic(topic)}
                  onRequestDelete={() => onRequestDeleteTopic(topic)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="hidden md:block border-b border-border-default px-4 pb-3.5">
          <button
            type="button"
            onClick={onRequestAddTopic}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--color-border-strong)] py-2 text-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Topic
          </button>
        </div>
      </div>
    </aside>
  );
};

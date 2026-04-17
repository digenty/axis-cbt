"use client";

import React, { useEffect, useRef, useState } from "react";
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
  // arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal, ConfirmModal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import {
  useAddCbtTopic,
  useDeleteCbtTopic,
  useUpdateCbtTopic,
} from "@/hooks/queryHooks/useQuestionBank";
import type { ApiTopic } from "@/types/question";
import { reorderByGroup } from "./reorder";

// ─── Props ────────────────────────────────────────────────────────────────────

interface QuestionBankSidebarProps {
  topics: ApiTopic[];
  classId: number;
  subjectId: number;
  selectedTopicId: number | null;
  isLoading?: boolean;
  onSelectTopic: (id: number) => void;
  onImportQuestions: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QuestionBankSidebar = ({
  topics,
  classId,
  subjectId,
  selectedTopicId,
  isLoading,
  onSelectTopic,
  onImportQuestions,
}: QuestionBankSidebarProps) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTopic, setEditTopic] = useState<ApiTopic | null>(null);
  const [deleteTopic, setDeleteTopic] = useState<ApiTopic | null>(null);

  const { mutate: addTopic, isPending: isAdding } = useAddCbtTopic();
  const { mutate: updateTopic, isPending: isUpdating } = useUpdateCbtTopic();
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteCbtTopic();

  const { data: classDetailsResponse } = useGetClassDetails(classId);
  const branchId = classDetailsResponse?.data?.branchId ?? 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (_event: DragEndEvent) => {
    const { active, over } = _event;
    if (!over || active.id === over.id || !topics) return;

    const oldIdx = topics.findIndex((q) => q.id === active.id);
    const newIdx = topics.findIndex((q) => q.id === over.id);

    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(topics, oldIdx, newIdx);
    const orderedIds = reordered.map((t) => t.id);

    console.log({ orderedIds });

    // setTopics((prev) =>
    // 	reorderByGroup(prev, "subjectId", subjectId, orderedIds),
    // );
  };

  const handleAddTopic = (data: { name: string; description: string }) => {
    addTopic(
      {
        name: data.name,
        classId,
        subjectId,
        branchId,
        description: data.description,
        displayOrder: topics.length,
      },
      {
        onSuccess: (res) => {
          toast({ title: "Topic added successfully!", type: "success" });
          if (res.data?.id) onSelectTopic(res.data.id);
          setAddModalOpen(false);
        },
        onError: (err: unknown) => {
          const message =
            err && typeof err === "object" && "message" in err
              ? String((err as { message: string }).message)
              : "Could not add topic";
          toast({ title: message, type: "error" });
        },
      },
    );
  };

  const handleUpdateTopic = (data: { name: string; description: string }) => {
    if (!editTopic) return;
    updateTopic(
      {
        id: editTopic.id,
        payload: {
          name: data.name,
          description: data.description,
          classId,
          subjectId,
          branchId: editTopic.branchId ?? branchId,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Topic updated!", type: "success" });
          setEditTopic(null);
        },
        onError: (err: unknown) => {
          const message =
            err && typeof err === "object" && "message" in err
              ? String((err as { message: string }).message)
              : "Could not update topic";
          toast({ title: message, type: "error" });
        },
      },
    );
  };

  const handleDeleteTopic = () => {
    if (!deleteTopic) return;
    deleteMutation(deleteTopic.id, {
      onSuccess: () => {
        toast({ title: "Topic deleted", type: "success" });
        if (selectedTopicId === deleteTopic.id) {
          const remaining = topics.filter((t) => t.id !== deleteTopic.id);
          if (remaining.length > 0) onSelectTopic(remaining[0].id);
        }
        setDeleteTopic(null);
      },
      onError: (err: unknown) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: string }).message)
            : "Could not delete topic";
        toast({ title: message, type: "error" });
      },
    });
  };

  return (
    <>
      <aside className="flex w-56 shrink-0 flex-col border-r border-gray-100 bg-white">
        {/* Import button */}
        <div className="px-3 pt-4 pb-3">
          <button
            onClick={onImportQuestions}
            className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Upload className="h-3.5 w-3.5" />
            Import questions
          </button>
        </div>

        {/* Topic list */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={topics?.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {topics?.map((topic) => (
                  <SortableTopicItem
                    key={topic.id}
                    topic={topic}
                    isSelected={selectedTopicId === topic.id}
                    onSelect={() => onSelectTopic(topic.id)}
                    onEdit={() => setEditTopic(topic)}
                    onDelete={() => setDeleteTopic(topic)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* New Topic button */}
        <div className="border-t border-gray-50 px-3 py-3">
          <button
            onClick={() => setAddModalOpen(true)}
            disabled={isAdding}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 disabled:opacity-50"
          >
            {isAdding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            New Topic
          </button>
        </div>
      </aside>

      <TopicModal
        open={addModalOpen}
        mode="add"
        saving={isAdding}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddTopic}
      />
      <TopicModal
        open={!!editTopic}
        mode="edit"
        saving={isUpdating}
        initialName={editTopic?.name}
        initialDescription={editTopic?.description}
        onClose={() => setEditTopic(null)}
        onSave={handleUpdateTopic}
      />
      <ConfirmModal
        open={!!deleteTopic}
        onClose={() => setDeleteTopic(null)}
        onConfirm={handleDeleteTopic}
        title="Delete Topic"
        description={`Are you sure you want to delete "${deleteTopic?.name}"? All questions in this topic will also be deleted.`}
        confirmLabel="Delete Topic"
        confirmVariant="danger"
        loading={isDeleting}
      />
    </>
  );
};

// ─── Sortable topic item ──────────────────────────────────────────────────────

const SortableTopicItem = ({
  topic,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  topic: ApiTopic;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div ref={setNodeRef} style={style} className="group relative mb-0.5">
      <div
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 transition-colors",
          isSelected
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-50",
        )}
        onClick={onSelect}
      >
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-gray-500 active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <span className="flex-1 truncate text-xs font-medium">
          {topic.name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-600",
            menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-0 left-full z-50 ml-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5 text-gray-400" />
            Edit Topic
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Topic
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Topic modal ──────────────────────────────────────────────────────────────

const TopicModal = ({
  open,
  mode,
  saving,
  initialName = "",
  initialDescription = "",
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "add" | "edit";
  saving?: boolean;
  initialName?: string;
  initialDescription?: string;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameError, setNameError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
      setNameError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialName, initialDescription]);

  const handleSave = () => {
    if (!name.trim()) {
      setNameError("Topic name is required");
      return;
    }
    onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Add New Topic" : "Edit Topic"}
      footer={
        <div className="flex items-center justify-between px-5 pb-5 gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {mode === "add" ? "Add Topic" : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Topic Name <span className="text-red-500">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") onClose();
            }}
            placeholder="Enter topic name"
            className={cn(
              "h-9 w-full rounded-lg border px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
              nameError ? "border-red-400" : "border-gray-200",
            )}
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-500">{nameError}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Description{" "}
            <span className="text-xs font-normal text-gray-400">
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") onClose();
            }}
            placeholder="Brief description of this topic"
            className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </Modal>
  );
};

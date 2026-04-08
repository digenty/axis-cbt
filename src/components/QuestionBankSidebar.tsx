"use client";

import { useState, useRef, useEffect } from "react";
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
	Plus,
	MoreVertical,
	Pencil,
	Trash2,
	Upload,
	GripVertical,
} from "lucide-react";
import { useCBTStore } from "@/store";
import { ApiTopic, Topic } from "@/types";
import { cn } from "@/lib/utils";
import { Modal } from "./Modal";
import { ConfirmModal } from "./Modal";
import { useAddCbtQuestionBankTopics } from "@/hooks/queryHooks/useQuestionBank";
import { CbtQueBankTopicPayload } from "@/api/question-bank";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import { toast } from "./Toast";

interface QuestionBankSidebarProps {
	topics: ApiTopic[];
	classId: number;
	subjectId: number;
	selectedTopicId: number | null;
	onSelectTopic: (id: number) => void;
	onImportQuestions: () => void;
	refetchTopics: () => void;
}

export const QuestionBankSidebar = ({
	refetchTopics,
	topics,
	classId,
	subjectId,
	selectedTopicId,
	onSelectTopic,
	onImportQuestions,
}: QuestionBankSidebarProps) => {
	// const { reorderTopics } = useCBTStore();
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editTopic, setEditTopic] = useState<ApiTopic | null>(null);
	const [deleteTopic, setDeleteTopic] = useState<ApiTopic | null>(null);

	const { mutate: addTopic, isPending } = useAddCbtQuestionBankTopics();
	const { data: classDetailsResponse } = useGetClassDetails(Number(classId));
	const classDetails = classDetailsResponse?.data;

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		// const oldIdx = topics.findIndex((t) => t.id === active.id);
		// const newIdx = topics.findIndex((t) => t.id === over.id);
		// const reordered = arrayMove(topics, oldIdx, newIdx);
		// reorderTopics(
		// 	subjectId,
		// 	reordered.map((t) => t.id),
		// );
	};

	const handleAddTopic = (data: { name: string; description: string }) => {
		const payload: CbtQueBankTopicPayload = {
			name: data?.name,
			classId,
			subjectId,
			branchId: classDetails?.branchId,
			description: data?.description,
			displayOrder: 0,
			id: crypto.getRandomValues(new Uint32Array(1))[0],
		};

		addTopic(payload, {
			onError: (error) => {
				toast({
					title: error.message ?? "Something went wrong",
					description: "Could not add topic",
					type: "error",
				});
			},
			onSuccess: (data) => {
				refetchTopics();
				console.log({ addTopicSuccess: data });
				toast({
					title: "Topic saved successfully!",
					type: "success",
				});
			},
		});

		if (payload?.id) onSelectTopic(payload?.id);
		setAddModalOpen(false);
	};

	return (
		<>
			<aside className="flex w-56 shrink-0 flex-col border-r border-gray-100 bg-white">
				{/* Import */}
				<div className="px-3 pt-4 pb-3">
					<button
						onClick={onImportQuestions}
						className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50"
					>
						<Upload className="h-3.5 w-3.5" />
						Import questions
					</button>
				</div>

				{/* Topic list with DnD */}
				<div className="flex-1 overflow-y-auto px-2 py-1">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={topics?.map((t) => t?.id)}
							strategy={verticalListSortingStrategy}
						>
							{topics?.map((topic: ApiTopic) => (
								<SortableTopicItem
									key={topic?.id}
									topic={topic}
									isSelected={selectedTopicId === topic?.id}
									onSelect={() => onSelectTopic(topic?.id)}
									onEdit={() => setEditTopic(topic)}
									onDelete={() => setDeleteTopic(topic)}
								/>
							))}
						</SortableContext>
					</DndContext>
				</div>

				{/* New Topic button */}
				<div className="border-t border-gray-50 px-3 py-3">
					<button
						onClick={() => setAddModalOpen(true)}
						className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600"
					>
						<Plus className="h-3.5 w-3.5" />
						New Topic
					</button>
				</div>
			</aside>

			{/* Add Topic Modal */}
			<TopicModal
				open={addModalOpen}
				mode="add"
				onClose={() => setAddModalOpen(false)}
				onSave={handleAddTopic}
			/>

			{/* Edit Topic Modal */}
			<TopicModal
				open={!!editTopic}
				mode="edit"
				initialName={editTopic?.name}
				onClose={() => setEditTopic(null)}
				onSave={(name) => {
					// if (editTopic) {
					// 	useCBTStore.getState().updateTopic(editTopic.id, name);
					// 	setEditTopic(null);
					// }
				}}
			/>

			{/* Delete Confirm Modal */}
			<DeleteTopicModal
				topic={deleteTopic}
				selectedTopicId={selectedTopicId}
				onClose={() => setDeleteTopic(null)}
				onDeleted={(id) => {
					// const remaining = getTopicsBySubject(subjectId).filter(
					// 	(t) => t.id !== id,
					// );
					// if (selectedTopicId === id && remaining.length > 0) {
					// 	onSelectTopic(remaining[0].id);
					// }
					setDeleteTopic(null);
				}}
			/>
		</>
	);
};

// ─── Sortable Topic Item ──────────────────────────────────────────────────────
interface SortableTopicItemProps {
	topic: ApiTopic;
	isSelected: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const SortableTopicItem = ({
	topic,
	isSelected,
	onSelect,
	onEdit,
	onDelete,
}: SortableTopicItemProps) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const questionCount = useCBTStore(
		(s) => s.questions.filter((q) => q.topicId === topic.id).length,
	);

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

	// Close menu on outside click
	useEffect(() => {
		if (!menuOpen) return;
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false);
			}
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
				{/* Drag handle */}
				<button
					{...attributes}
					{...listeners}
					className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-gray-500 active:cursor-grabbing"
					onClick={(e) => e.stopPropagation()}
					aria-label="Drag to reorder"
				>
					<GripVertical className="h-3.5 w-3.5" />
				</button>

				<span className="flex-1 truncate text-xs font-medium">
					{topic.name}
				</span>

				{questionCount > 0 && (
					<span
						className={cn(
							"shrink-0 text-xs",
							isSelected ? "text-blue-400" : "text-gray-400",
						)}
					>
						{questionCount}
					</span>
				)}

				{/* Three-dot menu */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						setMenuOpen((v) => !v);
					}}
					className={cn(
						"flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-600",
						menuOpen
							? "opacity-100"
							: "opacity-0 group-hover:opacity-100",
					)}
				>
					<MoreVertical className="h-3.5 w-3.5" />
				</button>
			</div>

			{/* Dropdown menu */}
			{menuOpen && (
				<div
					ref={menuRef}
					className="absolute top-0 left-0 z-50 ml-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
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

// ─── Topic Modal (Add / Edit) ─────────────────────────────────────────────────
interface TopicModalProps {
	open: boolean;
	mode: "add" | "edit";
	initialName?: string;
	onClose: () => void;
	onSave: ({
		name,
		description,
	}: {
		name: string;
		description: string;
	}) => void;
}

const TopicModal = ({
	open,
	mode,
	initialName = "",
	onClose,
	onSave,
}: TopicModalProps) => {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setName(initialName);
			setDescription("");
			setError("");
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [open, initialName]);

	const handleSave = async () => {
		if (!name.trim()) {
			setError("Topic name is required");
			return;
		}
		setSaving(true);
		await new Promise((r) => setTimeout(r, 300));
		await onSave({ name, description });
		setSaving(false);
		setName("");
		setDescription("");
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			className="max-h-[90vh] gap-4 overflow-y-auto"
			title={mode === "add" ? "Add New Topic" : "Edit Topic"}
			// size="sm"
			footer={
				<div className="flex items-center justify-between px-5 pb-5">
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
						{mode === "add" ? "Add Topic" : "Done"}
					</button>
				</div>
			}
		>
			<div className="px-5 py-4">
				<label className="mb-1.5 block text-xs font-medium text-gray-700">
					Topic Name <span className="text-red-500">*</span>
				</label>
				<input
					ref={inputRef}
					type="text"
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						setError("");
					}}
					// onKeyDown={(e) => {
					// 	if (e.key === "Enter") handleSave();
					// 	if (e.key === "Escape") onClose();
					// }}
					placeholder="Enter topic name"
					className={cn(
						"h-9 w-full rounded-lg border px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
						error ? "border-red-400" : "border-gray-200",
					)}
				/>
				{error && <p className="mt-1 text-xs text-red-500">{error}</p>}
			</div>

			<div className="px-5 py-4">
				<label className="mb-1.5 block text-xs font-medium text-gray-700">
					Description
				</label>
				<input
					// ref={inputRef}
					type="text"
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
						setError("");
					}}
					// onKeyDown={(e) => {
					// 	if (e.key === "Enter") handleSave();
					// 	if (e.key === "Escape") onClose();
					// }}
					placeholder="Enter topic name"
					className={cn(
						"h-9 w-full rounded-lg border px-3 py-2 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
						error ? "border-red-400" : "border-gray-200",
					)}
				/>
				{error && <p className="mt-1 text-xs text-red-500">{error}</p>}
			</div>
		</Modal>
	);
};

// ─── Delete Topic Confirm ─────────────────────────────────────────────────────
interface DeleteTopicModalProps {
	topic: Topic | null;
	selectedTopicId: number | null;
	onClose: () => void;
	onDeleted: (id: string) => void;
}

const DeleteTopicModal = ({
	topic,
	onClose,
	onDeleted,
}: DeleteTopicModalProps) => {
	const { deleteTopic } = useCBTStore();
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		if (!topic) return;
		setLoading(true);
		await new Promise((r) => setTimeout(r, 300));
		deleteTopic(topic.id);
		onDeleted(topic.id);
		setLoading(false);
	};

	return (
		<ConfirmModal
			open={!!topic}
			onClose={onClose}
			onConfirm={handleConfirm}
			title="Delete Topic"
			description={`Are you sure you want to delete "${topic?.name}"? All questions in this topic will also be deleted.`}
			confirmLabel="Delete Topic"
			confirmVariant="danger"
			loading={loading}
		/>
	);
};

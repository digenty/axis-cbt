"use client";
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	subtitle?: string;
	children: React.ReactNode;
	size?: ModalSize;
	/** Hides the default header so you can render a fully custom header */
	hideHeader?: boolean;
	/** Footer content rendered in the standard footer slot */
	footer?: React.ReactNode;
	/** Prevent backdrop click from closing */
	disableBackdropClose?: boolean;
	className?: string;
}

const SIZES: Record<ModalSize, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-2xl",
	"2xl": "max-w-3xl",
	full: "max-w-5xl",
};

export const Modal = ({
	open,
	onClose,
	title,
	subtitle,
	children,
	size = "md",
	hideHeader = false,
	footer,
	disableBackdropClose = false,
	className,
}: ModalProps) => {
	const contentRef = useRef<HTMLDivElement>(null);

	// Lock body scroll while open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Close on Escape
	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
		>
			{/* Backdrop */}
			<div
				className="animate-fadeIn absolute inset-0 bg-black/50 backdrop-blur-[2px]"
				onClick={disableBackdropClose ? undefined : onClose}
			/>

			{/* Panel */}
			<div
				ref={contentRef}
				className={clsx(
					"animate-modalIn relative flex max-h-[85vh]! w-full flex-col rounded-xl bg-white shadow-2xl",
					SIZES[size],
					className,
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				{!hideHeader && (
					<div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4">
						<div>
							{title && (
								<h2 className="text-sm font-semibold text-gray-900">
									{title}
								</h2>
							)}
							{subtitle && (
								<p className="mt-0.5 text-xs text-gray-500">
									{subtitle}
								</p>
							)}
						</div>
						<button
							onClick={onClose}
							className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
							aria-label="Close"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				)}

				{/* Body */}
				<div className="flex-1 overflow-y-auto">{children}</div>

				{/* Footer */}
				{footer && (
					<div className="flex shrink-0 items-center justify-end gap-2.5 rounded-b-xl border-t border-gray-100 bg-gray-50/50 px-5 py-3.5">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
interface ConfirmModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description?: string;
	confirmLabel?: string;
	confirmVariant?: "danger" | "primary";
	loading?: boolean;
}

export const ConfirmModal = ({
	open,
	onClose,
	onConfirm,
	title,
	description,
	confirmLabel = "Confirm",
	confirmVariant = "danger",
	loading,
}: ConfirmModalProps) => (
	<Modal open={open} onClose={onClose} title={title} size="sm">
		{description && (
			<p className="px-5 py-4 text-sm text-gray-600">{description}</p>
		)}
		<div className="flex justify-end gap-2 px-5 pb-4">
			<button
				onClick={onClose}
				className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
			>
				Cancel
			</button>
			<button
				onClick={onConfirm}
				disabled={loading}
				className={clsx(
					"rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60",
					confirmVariant === "danger"
						? "bg-red-600 hover:bg-red-700"
						: "bg-blue-600 hover:bg-blue-700",
				)}
			>
				{loading ? "..." : confirmLabel}
			</button>
		</div>
	</Modal>
);

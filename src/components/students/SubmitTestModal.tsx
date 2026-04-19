"use client";

import { X, AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
	onClose: () => void;
	onConfirm: () => void;
	submitting: boolean;
}

export const SubmitTestModal = ({ onClose, onConfirm, submitting }: Props) => (
	<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
		<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
			{/* Header */}
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-base font-bold text-gray-900">Submit Test?</h2>
				<button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
					<X className="h-5 w-5" />
				</button>
			</div>

			{/* Body */}
			<p className="mb-4 text-sm text-gray-600">
				Are you sure you want to submit your test? This action cannot be undone.
			</p>

			<div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
				<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
				<p className="text-xs text-amber-700">
					Once you submit, you cannot go back to change your answers. Cross-check your
					answers before submitting
				</p>
			</div>

			{/* Buttons */}
			<div className="flex items-center gap-3">
				<button
					onClick={onClose}
					className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					<RotateCcw className="h-3.5 w-3.5" />
					Return to question
				</button>
				<button
					onClick={onConfirm}
					disabled={submitting}
					className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
				>
					{submitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
					Submit Test
				</button>
			</div>
		</div>
	</div>
);

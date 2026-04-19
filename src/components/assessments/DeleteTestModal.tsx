"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";

interface DeleteTestModalProps {
  open: boolean;
  testTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteTestModal = ({
  open,
  testTitle,
  onClose,
  onConfirm,
}: DeleteTestModalProps) => {
  console.log({ DeleteTestModalTestTitle: testTitle });
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setAcknowledged(false);
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setAcknowledged(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="max-h-[90vh] overflow-y-auto"
      title="Delete Test?"
    >
      <div className="space-y-4 px-6 py-4">
        <p className="text-sm text-gray-700">
          Are you sure you want to permanently delete this test? This action
          cannot be undone.
        </p>

        {/* Warning box */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            This will remove the test and all associated questions, settings,
            and results linked to it. Students will no longer be able to access
            this test.
          </p>
        </div>

        {/* Acknowledge checkbox */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-blue-600"
          />
          <span className="text-sm text-gray-700">
            I understand that deleting this question is permanent and cannot be
            undone.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!acknowledged || loading}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              acknowledged && !loading
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-gray-100 text-gray-400",
            )}
          >
            {loading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            Delete Test
          </button>
        </div>
      </div>
    </Modal>
  );
};

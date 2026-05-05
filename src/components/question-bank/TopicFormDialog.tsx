"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/useIsMobile";

interface TopicFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "add" | "edit";
  initialName?: string;
  initialDescription?: string;
  loading?: boolean;
  onSubmit: (draft: { name: string; description: string }) => void;
}

export const TopicFormDialog = ({
  open,
  setOpen,
  mode,
  initialName,
  initialDescription,
  loading = false,
  onSubmit,
}: TopicFormDialogProps) => {
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const isMobile = useIsMobile();

  const cancel = () => {
    if (loading) return;
    setName(initialName ?? "");
    setDescription(initialDescription ?? "");
    setOpen(false);
  };

  const submit = () => {
    if (loading) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit({ name: trimmed, description: description.trim() });
    // Parent decides when to close — wait for the mutation's onSuccess.
  };

  const handleOpenChange = (next: boolean) => {
    if (loading) return;
    if (next) setOpen(true);
    else cancel();
  };

  const title = mode === "add" ? "Add New Topic" : "Edit Topic";
  const primaryLabel = mode === "add" ? "Add Topic" : "Save";

  const body = (
    <div className="px-4 py-4 space-y-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-text-default">
          Topic Name <span className="text-icon-destructive">*</span>
        </label>
        <Input
          autoFocus
          className="border-none"
          placeholder="Enter topic name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-text-default">
          Description
        </label>
        <textarea
          className="w-full rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60"
          placeholder="Optional"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
    </div>
  );

  const cancelButton = (
    <Button
      variant="outline"
      onClick={cancel}
      disabled={loading}
      className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-3 py-1 text-sm font-medium"
    >
      Cancel
    </Button>
  );

  const actionButton = (
    <Button
      onClick={submit}
      disabled={!name.trim() || loading}
      className="h-7 px-3 text-sm font-medium"
    >
      {loading && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
      {primaryLabel}
    </Button>
  );

  return (
    <>
      {!isMobile && (
        <Modal
          open={open}
          setOpen={handleOpenChange}
          title={title}
          cancelButton={cancelButton}
          ActionButton={actionButton}
        >
          {body}
        </Modal>
      )}

      {isMobile && (
        <MobileDrawer open={open} setIsOpen={handleOpenChange} title={title}>
          {body}
          <div className="flex items-center justify-between gap-2 border-t border-border-default p-4">
            {cancelButton}
            {actionButton}
          </div>
        </MobileDrawer>
      )}
    </>
  );
};

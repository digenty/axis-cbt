"use client";

import { useState } from "react";
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
  onSubmit: (name: string) => void;
}

export const TopicFormDialog = ({
  open,
  setOpen,
  mode,
  initialName,
  onSubmit,
}: TopicFormDialogProps) => {
  const [draft, setDraft] = useState(initialName ?? "");
  const isMobile = useIsMobile();

  const cancel = () => {
    setDraft(initialName ?? "");
    setOpen(false);
  };

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) setOpen(true);
    else cancel();
  };

  const title = mode === "add" ? "Add New Topic" : "Edit Topic";
  const primaryLabel = mode === "add" ? "Add Topic" : "Save";

  const body = (
    <div className="px-4 py-4">
      <label className="mb-2 block text-sm font-medium text-text-default">
        Topic Name <span className="text-icon-destructive">*</span>
      </label>
      <Input
        autoFocus
        className="border-none"
        placeholder="Enter topic name"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
      />
    </div>
  );

  const cancelButton = (
    <Button
      variant="outline"
      onClick={cancel}
      className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-3 py-1 text-sm font-medium"
    >
      Cancel
    </Button>
  );

  const actionButton = (
    <Button
      onClick={submit}
      disabled={!draft.trim()}
      className="h-7 px-3 text-sm font-medium"
    >
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

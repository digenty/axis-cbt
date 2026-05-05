"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/useIsMobile";

interface DeleteTopicDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteTopicDialog = ({
  open,
  setOpen,
  onConfirm,
}: DeleteTopicDialogProps) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const isMobile = useIsMobile();

  const cancel = () => {
    setAcknowledged(false);
    setOpen(false);
  };

  const confirm = () => {
    if (!acknowledged) return;
    onConfirm();
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) setOpen(true);
    else cancel();
  };

  const body = (
    <div className="flex flex-col gap-4 px-4 py-4">
      <p className="text-sm text-text-default">
        Are you sure you want to permanently delete this topic? This action
        cannot be undone.
      </p>

      <div className="flex items-start gap-3 rounded-md border border-border-amber bg-bg-badge-amber p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-icon-warning" />
        <p className="text-sm text-text-default">
          Any questions under this topic will be permanently removed and cannot
          be recovered.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-text-default">
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(value) => setAcknowledged(value === true)}
          className="mt-0.5"
        />
        <span>
          I understand that deleting this topic will permanently remove all
          questions within it.
        </span>
      </label>
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
      variant="destructive"
      onClick={confirm}
      disabled={!acknowledged}
      className="h-7 px-3 text-sm font-medium"
    >
      Delete Topic
    </Button>
  );

  return (
    <>
      {!isMobile && (
        <Modal
          open={open}
          setOpen={handleOpenChange}
          title="Delete Topic?"
          cancelButton={cancelButton}
          ActionButton={actionButton}
        >
          {body}
        </Modal>
      )}

      {isMobile && (
        <MobileDrawer
          open={open}
          setIsOpen={handleOpenChange}
          title="Delete Topic?"
        >
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

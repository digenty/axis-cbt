"use client";

import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";

interface RemoveQuestionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const RemoveQuestionDialog = ({
  open,
  setOpen,
  onConfirm,
  isLoading = false,
}: RemoveQuestionDialogProps) => {
  const isMobile = useIsMobile();

  const cancel = () => setOpen(false);

  const confirm = () => {
    onConfirm();
  };

  const handleOpenChange = (next: boolean) => {
    if (next) setOpen(true);
    else cancel();
  };

  const body = (
    <div className="px-4 py-4">
      <p className="text-sm text-text-default">
        Remove this question from the section? The question will remain in the
        question bank and can be re-added at any time.
      </p>
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
      disabled={isLoading}
      className="h-7 px-3 text-sm font-medium"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        "Remove Question"
      )}
    </Button>
  );

  return (
    <>
      {!isMobile && (
        <Modal
          open={open}
          setOpen={handleOpenChange}
          title="Remove Question?"
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
          title="Remove Question?"
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

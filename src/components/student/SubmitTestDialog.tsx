"use client";

import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SubmitTestDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  answeredCount: number;
  totalQuestions: number;
}

export const SubmitTestDialog = ({
  open,
  setOpen,
  onConfirm,
  isLoading = false,
  answeredCount,
  totalQuestions,
}: SubmitTestDialogProps) => {
  const isMobile = useIsMobile();

  const body = (
    <div className="flex flex-col gap-4 px-4 py-4">
      <p className="text-sm text-text-default">
        You answered {answeredCount} out of {totalQuestions} questions.
        Submitted answers can&apos;t be changed.
      </p>
    </div>
  );

  const cancelButton = (
    <Button
      variant="outline"
      onClick={() => setOpen(false)}
      className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-3 py-1 text-sm font-medium"
    >
      Keep going
    </Button>
  );

  const actionButton = (
    <Button
      onClick={onConfirm}
      disabled={isLoading}
      className="h-7 px-3 text-sm font-medium"
    >
      {isLoading && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
      Submit
    </Button>
  );

  return (
    <>
      {!isMobile && (
        <Modal
          open={open}
          setOpen={setOpen}
          title="Submit your test?"
          cancelButton={cancelButton}
          ActionButton={actionButton}
        >
          {body}
        </Modal>
      )}

      {isMobile && (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Submit your test?">
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

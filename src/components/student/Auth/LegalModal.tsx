"use client";
import React from "react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";

interface LegalModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  content: string;
}

function renderBodyLines(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("- ")) {
      return (
        <div key={i} className="mt-1 flex gap-2">
          <span className="text-text-muted shrink-0">•</span>
          <p className="text-text-muted text-sm leading-relaxed">
            {line.slice(2)}
          </p>
        </div>
      );
    }
    return line ? (
      <p
        key={i}
        className="text-text-muted mt-1 text-sm leading-relaxed first:mt-0"
      >
        {line}
      </p>
    ) : null;
  });
}

function renderContent(content: string) {
  const blocks = content.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const first = lines[0];
    const isNumberedHeader = /^\d+\.\s+\S/.test(first);
    const isStandaloneHeader =
      lines.length === 1 && !/^[-\d]/.test(first) && first.length <= 60;

    if (isNumberedHeader || isStandaloneHeader) {
      const body = lines.slice(1).join("\n");
      return (
        <div key={i} className={i === 0 ? "" : "mt-6"}>
          <h2 className="text-text-default mb-2 text-sm font-semibold">
            {first}
          </h2>
          {body && <div>{renderBodyLines(body)}</div>}
        </div>
      );
    }

    return (
      <div key={i} className={i === 0 ? "" : "mt-3"}>
        {renderBodyLines(block)}
      </div>
    );
  });
}

export const LegalModal: React.FC<LegalModalProps> = ({
  open,
  setOpen,
  title,
  content,
}) => {
  const isMobile = useIsMobile();

  const formattedContent = (
    <div className="max-h-[70vh] overflow-y-auto px-4 py-4 md:px-6">
      <div className="text-text-muted text-sm leading-relaxed">
        {renderContent(content)}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title={title}>
        {formattedContent}
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={setOpen} title={title} showFooter={false}>
      {formattedContent}
    </Modal>
  );
};

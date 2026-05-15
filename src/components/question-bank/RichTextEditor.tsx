"use client";

import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  Heading1,
  Heading2,
  Quote,
  Code,
  List,
  ListOrdered,
  Indent,
  Outdent,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Sigma,
  Eraser,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const TOOLBAR_GROUPS: {
  icon: React.ComponentType<{ className?: string }>;
  cmd: string;
  value?: string;
  label: string;
}[][] = [
  [
    { icon: Bold, cmd: "bold", label: "Bold" },
    { icon: Italic, cmd: "italic", label: "Italic" },
    { icon: Underline, cmd: "underline", label: "Underline" },
    { icon: Strikethrough, cmd: "strikeThrough", label: "Strike" },
    { icon: Superscript, cmd: "superscript", label: "Superscript" },
    { icon: Subscript, cmd: "subscript", label: "Subscript" },
  ],
  [
    { icon: Heading1, cmd: "formatBlock", value: "<h1>", label: "Heading 1" },
    { icon: Heading2, cmd: "formatBlock", value: "<h2>", label: "Heading 2" },
    {
      icon: Quote,
      cmd: "formatBlock",
      value: "<blockquote>",
      label: "Quote",
    },
    { icon: Code, cmd: "formatBlock", value: "<pre>", label: "Code block" },
  ],
  [
    { icon: List, cmd: "insertUnorderedList", label: "Bulleted list" },
    { icon: ListOrdered, cmd: "insertOrderedList", label: "Numbered list" },
    { icon: Indent, cmd: "indent", label: "Indent" },
    { icon: Outdent, cmd: "outdent", label: "Outdent" },
  ],
  [
    { icon: AlignLeft, cmd: "justifyLeft", label: "Align left" },
    { icon: AlignCenter, cmd: "justifyCenter", label: "Align center" },
    { icon: AlignRight, cmd: "justifyRight", label: "Align right" },
    { icon: AlignJustify, cmd: "justifyFull", label: "Justify" },
  ],
];

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Type or paste your content",
  className,
  minHeight = "120px",
}: RichTextEditorProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-2 py-1.5">
        <select
          className="mr-1 h-7 rounded border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-2 text-xs text-[var(--color-text-default)] focus:outline-none"
          onChange={(e) => exec("formatBlock", e.target.value)}
          defaultValue="<p>"
        >
          <option value="<p>">Normal</option>
          <option value="<h1>">Heading 1</option>
          <option value="<h2>">Heading 2</option>
          <option value="<h3>">Heading 3</option>
        </select>

        {TOOLBAR_GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center">
            {gi > 0 && (
              <span className="mx-1 h-5 w-px bg-[var(--color-border-default)]" />
            )}
            {group.map(({ icon: Icon, cmd, value: cmdValue, label }) => (
              <button
                key={label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => exec(cmd, cmdValue)}
                title={label}
                className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        ))}

        <span className="mx-1 h-5 w-px bg-[var(--color-border-default)]" />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
          title="Insert link"
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) exec("insertImage", url);
          }}
          title="Insert image"
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </button>
        <span className="mx-1 h-5 w-px bg-[var(--color-border-default)]" />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            exec("insertText", window.prompt("Math expression") ?? "")
          }
          title="Equation"
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <Sigma className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("removeFormat")}
          title="Clear formatting"
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <Eraser className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        className="w-full px-3 py-2.5 text-sm text-[var(--color-text-default)] focus:outline-none [&:empty]:before:text-[var(--color-text-muted)] [&:empty]:before:content-[attr(data-placeholder)] [&_*]:![font-size:inherit] [&_*]:![font-family:inherit]"
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  );
};

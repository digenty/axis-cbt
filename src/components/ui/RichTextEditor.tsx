"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const TOOLBAR_BUTTONS = [
  { cmd: "bold", icon: "B", title: "Bold", className: "font-bold" },
  { cmd: "italic", icon: "I", title: "Italic", className: "italic" },
  { cmd: "underline", icon: "U", title: "Underline", className: "underline" },
  {
    cmd: "strikeThrough",
    icon: "S",
    title: "Strikethrough",
    className: "line-through",
  },
  {
    cmd: "superscript",
    icon: "x²",
    title: "Superscript",
    className: "text-xs",
  },
  { cmd: "subscript", icon: "x₂", title: "Subscript", className: "text-xs" },
];

const BLOCK_FORMATS = [
  { value: "p", label: "Normal" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
];

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className,
  minHeight = "120px",
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdating.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const execCmd = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdating.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    }
  }, [onChange]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-200 bg-white transition focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        <select
          title="heading"
          className="mr-1 h-7 rounded border border-gray-200 bg-white px-1.5 py-1 text-xs focus:outline-none"
          onChange={(e) => execCmd("formatBlock", e.target.value)}
          defaultValue="p"
        >
          {BLOCK_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            title={btn.title}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded text-xs text-gray-600 transition-colors hover:bg-gray-200",
              btn.className,
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd(btn.cmd);
            }}
          >
            {btn.icon}
          </button>
        ))}

        <div className="mx-1 h-5 w-px bg-gray-200" />

        <button
          type="button"
          title="Unordered List"
          className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-200"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("insertUnorderedList");
          }}
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 6a1 1 0 110-2 1 1 0 010 2zm4-1h8a1 1 0 110 2H8a1 1 0 110-2zm-4 5a1 1 0 110-2 1 1 0 010 2zm4-1h8a1 1 0 110 2H8a1 1 0 110-2zm-4 5a1 1 0 110-2 1 1 0 010 2zm4-1h8a1 1 0 110 2H8a1 1 0 110-2z" />
          </svg>
        </button>

        <button
          type="button"
          title="Ordered List"
          className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-200"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("insertOrderedList");
          }}
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h1v1H3V4zm2 0h10a1 1 0 010 2H5a1 1 0 010-2zm-2 4h1v1H3V8zm2 0h10a1 1 0 010 2H5a1 1 0 010-2zm-2 4h1v1H3v-1zm2 0h10a1 1 0 010 2H5a1 1 0 010-2z" />
          </svg>
        </button>

        <button
          type="button"
          title="Insert Link"
          className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-200"
          onMouseDown={(e) => {
            e.preventDefault();
            const url = prompt("Enter URL:");
            if (url) execCmd("createLink", url);
          }}
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={cn(
          "px-3 py-2.5 text-sm leading-relaxed text-gray-800 outline-none",
          "empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]",
        )}
      />
    </div>
  );
};

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Image,
  Quote,
  Code,
  Table2,
  HelpCircle,
  Undo,
  Redo,
  Minus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── Toolbar Button ──────────────────────────────────────────────────

function ToolbarBtn({
  icon: Icon,
  label,
  onClick,
  isActive,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-md transition-colors disabled:opacity-30",
        isActive
          ? "bg-primary-100 text-primary-700"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

// ── Editor Component ────────────────────────────────────────────────

interface TiptapEditorProps {
  content: string;
  onUpdate: (html: string, text: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content,
  onUpdate,
  placeholder = "Start writing your article...",
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary-600 underline" },
      }),
      ImageExt.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto my-4" },
      }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[60vh] px-6 py-4",
      },
    },
    onUpdate: ({ editor: e }) => {
      onUpdate(e.getHTML(), e.getText());
    },
  });

  // Sync external content changes (e.g. AI generation)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const insertFaq = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent(
        `<h2>Frequently Asked Questions</h2>
        <h3>What is this tool?</h3>
        <p>Answer goes here.</p>
        <h3>Is it worth the price?</h3>
        <p>Answer goes here.</p>
        <h3>What are the alternatives?</h3>
        <p>Answer goes here.</p>
        <h3>Who should use this?</h3>
        <p>Answer goes here.</p>
        <h3>How does it compare to competitors?</h3>
        <p>Answer goes here.</p>`
      )
      .run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b px-3 py-1.5 flex flex-wrap items-center gap-0.5">
        <ToolbarBtn
          icon={Bold}
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        />
        <ToolbarBtn
          icon={Italic}
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        />
        <Separator orientation="vertical" className="h-5 mx-1" />
        <ToolbarBtn
          icon={Heading2}
          label="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        />
        <ToolbarBtn
          icon={Heading3}
          label="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        />
        <Separator orientation="vertical" className="h-5 mx-1" />
        <ToolbarBtn
          icon={List}
          label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        />
        <ToolbarBtn
          icon={ListOrdered}
          label="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        />
        <Separator orientation="vertical" className="h-5 mx-1" />
        <ToolbarBtn
          icon={Link2}
          label="Link"
          onClick={addLink}
          isActive={editor.isActive("link")}
        />
        <ToolbarBtn icon={Image} label="Image" onClick={addImage} />
        <ToolbarBtn
          icon={Quote}
          label="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        />
        <ToolbarBtn
          icon={Code}
          label="Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        />
        <ToolbarBtn icon={Minus} label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <Separator orientation="vertical" className="h-5 mx-1" />
        <ToolbarBtn icon={Table2} label="Table" onClick={insertTable} />
        <ToolbarBtn icon={HelpCircle} label="FAQ Block" onClick={insertFaq} />
        <Separator orientation="vertical" className="h-5 mx-1" />
        <ToolbarBtn
          icon={Undo}
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        />
        <ToolbarBtn
          icon={Redo}
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        />
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export function getEditorWordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

'use client';

import React, { useRef } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Quote,
  Code,
  FileCode,
  List,
  ListOrdered,
  CheckSquare,
  Table,
  Link2,
  Image as ImageIcon,
  Sigma,
  GitBranch,
  Minus,
  FolderOpen,
  Trash2
} from 'lucide-react';

interface ToolbarProps {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
  onInsertBlock: (template: string) => void;
  onClear: () => void;
  onFileSelect: (text: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onInsert,
  onInsertBlock,
  onClear,
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      onFileSelect(evt.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-surface-card border-b border-surface-border px-3 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs flex-shrink-0 select-none">
      {/* Headings */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onInsert('# ', '', 'Heading 1')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('## ', '', 'Heading 2')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('### ', '', 'Heading 3')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="h-4 w-px bg-surface-border mx-1" />

      {/* Formatting */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onInsert('**', '**', 'bold text')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('*', '*', 'italic text')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('~~', '~~', 'strikethrough')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('> ', '', 'blockquote')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('`', '`', 'code')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsertBlock('\n```typescript\n// Write code here\nconsole.log("Hello World");\n```\n')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Code Block"
        >
          <FileCode className="w-4 h-4" />
        </button>
      </div>

      <div className="h-4 w-px bg-surface-border mx-1" />

      {/* Lists & Tables */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onInsert('- ', '', 'List item')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('1. ', '', 'First item')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('- [ ] ', '', 'Task to complete')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Task List"
        >
          <CheckSquare className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            onInsertBlock('\n| Header 1 | Header 2 | Header 3 |\n| :--- | :---: | ---: |\n| Row 1 | Data | 100 |\n| Row 2 | Data | 200 |\n')
          }
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Insert Table"
        >
          <Table className="w-4 h-4" />
        </button>
      </div>

      <div className="h-4 w-px bg-surface-border mx-1" />

      {/* Media & Advanced */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onInsert('[', '](https://abishek.in)', 'Link text')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsert('![', '](https://via.placeholder.com/600x300)', 'Alt text')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsertBlock('\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded text-indigo-400"
          title="KaTeX Math Formula"
        >
          <Sigma className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            onInsertBlock('\n```mermaid\ngraph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Success]\n  B -->|No| D[Retry]\n```\n')
          }
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded text-blue-400"
          title="Mermaid Diagram"
        >
          <GitBranch className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInsertBlock('\n---\n')}
          className="p-1 text-slate-300 hover:text-white hover:bg-surface-hover rounded"
          title="Divider Line"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* File & Presets */}
      <div className="flex items-center gap-1.5 ml-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".md,.markdown,.txt"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-subtle hover:bg-surface-hover text-slate-300 hover:text-white transition-colors"
          title="Open markdown file"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open .md</span>
        </button>

        <button
          onClick={onClear}
          className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-surface-hover"
          title="Clear Document"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

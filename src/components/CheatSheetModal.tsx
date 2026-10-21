'use client';

import React from 'react';
import { X, BookOpen } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Markdown Quick Reference</h3>
              <p className="text-[11px] text-slate-400">GFM, KaTeX Math & Mermaid Syntax</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-slate-400">
                <th className="py-2 font-semibold">Element</th>
                <th className="py-2 font-semibold">Markdown Syntax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-slate-200">
              <tr>
                <td className="py-2.5 text-slate-400">Headings</td>
                <td className="py-2.5 font-mono text-blue-400"># H1, ## H2, ### H3</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Bold & Italic</td>
                <td className="py-2.5 font-mono text-blue-400">**bold**, *italic*</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Strikethrough</td>
                <td className="py-2.5 font-mono text-blue-400">~~strikethrough~~</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Blockquote</td>
                <td className="py-2.5 font-mono text-blue-400">&gt; Quote text</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Task List</td>
                <td className="py-2.5 font-mono text-blue-400">- [ ] Incomplete, - [x] Done</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Code Block</td>
                <td className="py-2.5 font-mono text-blue-400">```javascript ... ```</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Table</td>
                <td className="py-2.5 font-mono text-blue-400">| Head | Head | \n | --- | --- |</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Inline Math</td>
                <td className="py-2.5 font-mono text-indigo-400">$E = mc^2$</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Display Math</td>
                <td className="py-2.5 font-mono text-indigo-400">$$\sum_{'{i=1}'}^n x_i$$</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-400">Mermaid Diagram</td>
                <td className="py-2.5 font-mono text-blue-400">```mermaid \n graph TD; A--&gt;B; \n ```</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

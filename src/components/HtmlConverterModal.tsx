'use client';

import React, { useState } from 'react';
import { convertHtmlToMarkdown } from '@/lib/markdown';
import { X, Code2 } from 'lucide-react';

interface HtmlConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (md: string) => void;
}

export const HtmlConverterModal: React.FC<HtmlConverterModalProps> = ({
  isOpen,
  onClose,
  onConvert
}) => {
  const [html, setHtml] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    if (!html.trim()) return;
    const md = convertHtmlToMarkdown(html);
    onConvert(md);
    onClose();
    setHtml('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Convert HTML to Markdown</h3>
              <p className="text-[11px] text-slate-400">Paste raw HTML and extract clean Markdown formatting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<h1>Title</h1><p>Paste HTML here...</p>"
            className="w-full h-48 bg-surface-subtle border border-surface-border rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div className="px-5 py-3 border-t border-surface-border flex items-center justify-end gap-2 bg-surface-subtle/30">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm"
          >
            Convert & Insert into Editor
          </button>
        </div>
      </div>
    </div>
  );
};

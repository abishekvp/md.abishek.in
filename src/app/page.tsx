'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ViewMode } from '@/types';
import {
  computeStats,
  extractToc,
  parseMarkdownToHtml
} from '@/lib/markdown';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { TocSidebar } from '@/components/TocSidebar';
import { StatusBar } from '@/components/StatusBar';
import { CheatSheetModal } from '@/components/CheatSheetModal';
import { HtmlConverterModal } from '@/components/HtmlConverterModal';

export default function MarkdownPage() {
  const [markdown, setMarkdown] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showToc, setShowToc] = useState<boolean>(false);
  const [syncScroll, setSyncScroll] = useState<boolean>(true);

  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState<boolean>(false);
  const [htmlCopied, setHtmlCopied] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Computations
  const stats = useMemo(() => computeStats(markdown), [markdown]);
  const tocItems = useMemo(() => extractToc(markdown), [markdown]);
  const renderedHtml = useMemo(() => parseMarkdownToHtml(markdown), [markdown]);

  // Sync scroll
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!syncScroll || !previewRef.current || viewMode !== 'split') return;
    const target = e.currentTarget;
    const percentage = target.scrollTop / (target.scrollHeight - target.clientHeight);
    previewRef.current.scrollTop = percentage * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
  };

  // Insertion helper
  const handleInsert = (prefix: string, suffix = '', defaultText = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = markdown.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextVal = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(nextVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleInsertBlock = (block: string) => {
    const el = textareaRef.current;
    if (!el) {
      setMarkdown((prev) => prev + block);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const nextVal = markdown.substring(0, start) + block + markdown.substring(end);
    setMarkdown(nextVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + block.length, start + block.length);
    }, 0);
  };

  const handleTocSelect = (id: string) => {
    if (viewMode === 'editor') setViewMode('split');
    setTimeout(() => {
      const headingEl = document.getElementById(id);
      if (headingEl) {
        headingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setHtmlCopied(true);
    setTimeout(() => setHtmlCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const fullHtmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 40px auto; padding: 0 20px; }
    h1, h2, h3, h4 { color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; }
    blockquote { border-left: 4px solid #3b82f6; margin: 16px 0; padding-left: 16px; color: #475569; font-style: italic; }
  </style>
</head>
<body>
  ${renderedHtml}
</body>
</html>`;
    const blob = new Blob([fullHtmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const renderLines = (text: string) => {
    const count = Math.max(text.split('\n').length, 1);
    return Array.from({ length: count }, (_, i) => i + 1).join('\n');
  };

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-surface-darker text-slate-100">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        showToc={showToc}
        setShowToc={setShowToc}
        syncScroll={syncScroll}
        setSyncScroll={setSyncScroll}
        onOpenHtmlModal={() => setIsHtmlModalOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onDownloadMd={handleDownloadMd}
        onCopyHtml={handleCopyHtml}
        onDownloadHtml={handleDownloadHtml}
        onPrintPdf={handlePrintPdf}
        htmlCopied={htmlCopied}
      />

      <Toolbar
        onInsert={handleInsert}
        onInsertBlock={handleInsertBlock}
        onClear={() => setMarkdown('')}
        onFileSelect={(text) => setMarkdown(text)}
      />

      {/* Main Workspace Area with Optional TOC */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <TocSidebar
          items={tocItems}
          isOpen={showToc}
          onClose={() => setShowToc(false)}
          onSelect={handleTocSelect}
        />

        {/* Panes */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-border min-h-0 overflow-hidden">
          {/* Editor Column */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div
              className={`flex flex-col h-full bg-surface-card min-h-0 ${
                viewMode === 'editor' ? 'col-span-2' : ''
              }`}
            >
              <div className="h-8 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
                <span className="font-semibold text-slate-200">Markdown Source</span>
                <span>{markdown.length.toLocaleString()} characters</span>
              </div>

              <div className="flex-1 flex min-h-0 relative bg-[#0d131f]">
                <div className="w-10 py-3 bg-[#090d16] border-r border-surface-border/50 text-right pr-2 select-none text-[12px] font-mono text-slate-600 leading-relaxed overflow-hidden">
                  <pre className="m-0 p-0">{renderLines(markdown)}</pre>
                </div>
                <textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  onScroll={handleScroll}
                  spellCheck={false}
                  className="flex-1 p-4 bg-transparent text-slate-100 font-mono text-[13px] leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30 overflow-auto whitespace-pre"
                />
              </div>
            </div>
          )}

          {/* Preview Column */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`flex flex-col h-full bg-surface-card min-h-0 ${
                viewMode === 'preview' ? 'col-span-2' : ''
              }`}
            >
              <div className="h-8 px-3 border-b border-surface-border flex items-center justify-between text-xs text-slate-400 bg-surface-subtle/50 select-none flex-shrink-0">
                <span className="font-semibold text-slate-200">Live GFM Render</span>
                <span className="text-[11px] text-blue-400 font-medium">KaTeX + Mermaid Active</span>
              </div>

              <div
                ref={previewRef}
                className="flex-1 p-8 overflow-y-auto bg-[#070b14] text-slate-200 select-text"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          )}
        </div>
      </div>

      <StatusBar stats={stats} />

      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <HtmlConverterModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
        onConvert={(md) => handleInsertBlock('\n\n' + md + '\n\n')}
      />
    </main>
  );
}

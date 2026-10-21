'use client';

import React, { useState } from 'react';
import { ViewMode } from '@/types';
import {
  FileText,
  ChevronDown,
  Columns,
  Maximize,
  Minimize,
  Download,
  ExternalLink,
  BookOpen,
  ListTree,
  Code2,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showToc: boolean;
  setShowToc: (show: boolean) => void;
  syncScroll: boolean;
  setSyncScroll: (sync: boolean) => void;
  onOpenHtmlModal: () => void;
  onOpenCheatSheet: () => void;
  onDownloadMd: () => void;
  onCopyHtml: () => void;
  onDownloadHtml: () => void;
  onPrintPdf: () => void;
  htmlCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  showToc,
  setShowToc,
  syncScroll,
  setSyncScroll,
  onOpenHtmlModal,
  onOpenCheatSheet,
  onDownloadMd,
  onCopyHtml,
  onDownloadHtml,
  onPrintPdf,
  htmlCopied
}) => {
  const [suiteOpen, setSuiteOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-14 bg-surface-card border-b border-surface-border px-4 flex items-center justify-between gap-4 select-none flex-shrink-0 z-40">
      {/* Brand & Suite Switcher */}
      <div className="flex items-center gap-3">
        <a href="https://apps.abishek.in" className="flex items-center gap-2 group text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">
              Markdown<span className="text-blue-400">Studio</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              GFM
            </span>
          </div>
        </a>

        {/* Suite Switcher */}
        <div className="relative">
          <button
            onClick={() => setSuiteOpen(!suiteOpen)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border px-2.5 py-1.5 rounded-md transition-colors"
          >
            <span>All Tools</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {suiteOpen && (
            <div
              className="absolute top-full left-0 mt-1.5 w-60 bg-surface-card border border-surface-border rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
              onMouseLeave={() => setSuiteOpen(false)}
            >
              <a href="https://apps.abishek.in" className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 rounded-lg">
                🚀 Tools & Apps Hub (apps.abishek.in)
              </a>
              <div className="h-px bg-surface-border my-1" />
              <a href="https://md.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600/20 rounded-lg">
                📝 Markdown Studio Pro
              </a>
              <a href="https://base64.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                ⚡ Base64 Studio
              </a>
              <a href="https://compiler.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                💻 Web Compiler (HTML/CSS/JS)
              </a>
              <a href="https://json.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🌲 JSON Master Suite
              </a>
              <a href="https://prettier.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                ✨ Prettier Code Formatter
              </a>
              <a href="https://image.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🖼️ Image Compressor Pro
              </a>
              <a href="https://pdf.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                📄 PDF Toolkit
              </a>
              <a href="https://youtube.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🎥 YouTube Downloader
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Center View Controls */}
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg bg-surface-subtle p-0.5 border border-surface-border">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode('editor')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        <button
          onClick={() => setShowToc(!showToc)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
            showToc ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-surface-subtle text-slate-300 border-surface-border hover:text-white'
          }`}
          title="Toggle Document Outline"
        >
          <ListTree className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Outline</span>
        </button>

        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none ml-1 hidden lg:flex">
          <input
            type="checkbox"
            checked={syncScroll}
            onChange={(e) => setSyncScroll(e.target.checked)}
            className="rounded bg-surface-subtle border-surface-border text-blue-600 focus:ring-0 cursor-pointer"
          />
          <span>Sync Scroll</span>
        </label>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHtmlModal}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>HTML ➜ MD</span>
        </button>

        <button
          onClick={onOpenCheatSheet}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
          <span>Cheat Sheet</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {exportOpen && (
            <div
              className="absolute top-full right-0 mt-1.5 w-52 bg-surface-card border border-surface-border rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
              onMouseLeave={() => setExportOpen(false)}
            >
              <button
                onClick={() => {
                  onDownloadMd();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Download Markdown (.md)</span>
              </button>
              <button
                onClick={() => {
                  onCopyHtml();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2"
              >
                {htmlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{htmlCopied ? 'HTML Copied!' : 'Copy Rendered HTML'}</span>
              </button>
              <button
                onClick={() => {
                  onDownloadHtml();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Download Standalone HTML</span>
              </button>
              <button
                onClick={() => {
                  onPrintPdf();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        <a
          href="https://apps.abishek.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 shadow-sm"
        >
          <span>All Apps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
};

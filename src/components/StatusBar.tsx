'use client';

import React from 'react';
import { MarkdownStats } from '@/types';
import { CheckCheck } from 'lucide-react';

interface StatusBarProps {
  stats: MarkdownStats;
}

export const StatusBar: React.FC<StatusBarProps> = ({ stats }) => {
  return (
    <footer className="h-8 bg-surface-card border-t border-surface-border px-4 flex items-center justify-between text-[11px] text-slate-400 select-none flex-shrink-0">
      <div className="flex items-center gap-5">
        <div>
          <span className="font-semibold text-slate-200">{stats.words.toLocaleString()}</span> words
        </div>
        <div>
          <span className="font-semibold text-slate-200">{stats.chars.toLocaleString()}</span> characters
        </div>
        <div>
          <span className="font-semibold text-slate-200">{stats.lines.toLocaleString()}</span> lines
        </div>
        <div>
          <span className="font-semibold text-slate-200">~{stats.readTimeMin}</span> min read
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
        <CheckCheck className="w-3.5 h-3.5" />
        <span>Live Synced</span>
      </div>
    </footer>
  );
};

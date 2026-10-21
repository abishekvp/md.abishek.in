'use client';

import React from 'react';
import { TocItem } from '@/types';
import { X, ListTree } from 'lucide-react';

interface TocSidebarProps {
  items: TocItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const TocSidebar: React.FC<TocSidebarProps> = ({
  items,
  isOpen,
  onClose,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-surface-card border-r border-surface-border flex flex-col h-full z-20 flex-shrink-0 animate-in slide-in-from-left-4 duration-150">
      <div className="h-10 px-4 border-b border-surface-border flex items-center justify-between text-xs font-bold text-white bg-surface-subtle/40">
        <div className="flex items-center gap-2">
          <ListTree className="w-4 h-4 text-blue-400" />
          <span>Table of Contents</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        {items.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">
            No headings found. Add # H1 or ## H2 to build an outline.
          </div>
        ) : (
          items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(item.id)}
              style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
              className="w-full text-left py-1 text-xs text-slate-300 hover:text-blue-400 hover:bg-surface-hover/60 rounded transition-colors truncate"
            >
              <span className="opacity-40 mr-1.5 font-mono text-[10px]">H{item.level}</span>
              <span>{item.text}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

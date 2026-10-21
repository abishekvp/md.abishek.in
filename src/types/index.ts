export type ViewMode = 'split' | 'editor' | 'preview';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface MarkdownStats {
  words: number;
  chars: number;
  lines: number;
  readTimeMin: number;
}

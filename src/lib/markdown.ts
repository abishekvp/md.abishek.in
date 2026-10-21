import { TocItem, MarkdownStats } from '@/types';

export function computeStats(md: string): MarkdownStats {
  const chars = md.length;
  const lines = md.trim() ? md.split('\n').length : 0;
  const words = md.trim() ? md.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMin = Math.ceil(words / 200) || 1;
  return { words, chars, lines, readTimeMin };
}

export function extractToc(md: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = md.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      items.push({ id, text, level });
    }
  }

  return items;
}

export function convertHtmlToMarkdown(html: string): string {
  let md = html;

  // Clean scripts and styles
  md = md.replace(/<script[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

  // Bold & Italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');

  // Code & Pre
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n');

  // Lists
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(ul|ol)[^>]*>/gi, '\n');

  // Links & Images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Paragraphs & Breaks
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Strip remaining tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  md = md.replace(/&amp;/g, '&')
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .replace(/&quot;/g, '"')
         .replace(/&#39;/g, "'");

  return md.trim();
}

export function parseMarkdownToHtml(md: string): string {
  if (!md) return '';

  let html = md;

  // Escape basic raw HTML brackets inside plain text (except pre-existing intentional tags)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // KaTeX Display Math: $$formula$$
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    return `<div class="katex-math-display bg-surface-subtle p-3 rounded-lg border border-surface-border font-mono text-center my-3 text-indigo-300">$$ ${math.trim()} $$</div>`;
  });

  // KaTeX Inline Math: $formula$
  html = html.replace(/\$([^\$\n]+)\$/g, (_, math) => {
    return `<code class="katex-math-inline text-indigo-400 bg-surface-subtle px-1.5 py-0.5 rounded">$${math.trim()}$</code>`;
  });

  // Mermaid diagrams: ```mermaid ... ```
  html = html.replace(/```mermaid([\s\S]*?)```/g, (_, code) => {
    return `<div class="mermaid-diagram bg-[#0b101b] border border-blue-500/30 p-4 rounded-xl my-4 text-xs font-mono text-blue-300 overflow-x-auto"><div class="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-2">Mermaid Diagram</div><pre class="m-0">${code.trim()}</pre></div>`;
  });

  // Code blocks: ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang || 'code';
    return `<div class="code-block my-4 rounded-xl overflow-hidden border border-surface-border bg-[#0d131f] shadow-lg"><div class="px-3 py-1.5 bg-[#090d16] border-b border-surface-border/60 text-[11px] font-mono text-slate-400 font-semibold flex items-center justify-between"><span>${langLabel}</span></div><pre class="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed text-slate-200 m-0"><code>${code.trim()}</code></pre></div>`;
  });

  // Blockquotes: > quote
  html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-1 my-3 text-slate-300 italic bg-blue-500/5 rounded-r">$1</blockquote>');

  // Headings with IDs for TOC jumping
  html = html.replace(/^######\s+(.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h6 id="${id}" class="text-sm font-bold text-slate-300 mt-4 mb-2">${title}</h6>`;
  });
  html = html.replace(/^#####\s+(.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h5 id="${id}" class="text-base font-bold text-slate-300 mt-5 mb-2">${title}</h5>`;
  });
  html = html.replace(/^####\s+(.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h4 id="${id}" class="text-lg font-bold text-white mt-6 mb-2">${title}</h4>`;
  });
  html = html.replace(/^###\s+(.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h3 id="${id}" class="text-xl font-bold text-white mt-7 mb-2 border-b border-surface-border/40 pb-1">${title}</h3>`;
  });
  html = html.replace(/^##\s+(.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h2 id="${id}" class="text-2xl font-extrabold text-blue-400 mt-8 mb-3 border-b border-surface-border pb-1.5">${title}</h2>`;
  });
  html = html.replace(/^#\s+(.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h1 id="${id}" class="text-3xl font-black text-white mt-2 mb-4 tracking-tight">${title}</h1>`;
  });

  // Horizontal rules: ---
  html = html.replace(/^---$/gm, '<hr class="my-6 border-surface-border" />');

  // Task lists: - [x] or - [ ]
  html = html.replace(/^- \[x\]\s+(.+)$/gm, '<div class="flex items-center gap-2 text-slate-300 my-1"><input type="checkbox" checked disabled class="rounded text-blue-600" /> <span class="line-through text-slate-400">$1</span></div>');
  html = html.replace(/^- \[ \]\s+(.+)$/gm, '<div class="flex items-center gap-2 text-slate-300 my-1"><input type="checkbox" disabled class="rounded text-blue-600" /> <span>$1</span></div>');

  // Unordered list items: - or *
  html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li class="ml-4 list-disc text-slate-300 my-0.5">$1</li>');

  // Tables: simple markdown table parsing
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(Boolean);
    if (rows.length < 2) return tableBlock;

    let tableHtml = '<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse border border-surface-border rounded-lg text-xs">';
    rows.forEach((row, idx) => {
      if (row.includes('---')) return; // separator
      const cells = row.split('|').slice(1, -1).map(c => c.trim());
      if (idx === 0) {
        tableHtml += '<thead class="bg-surface-subtle font-bold text-white"><tr>';
        cells.forEach(c => tableHtml += `<th class="border border-surface-border px-3 py-2">${c}</th>`);
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr class="hover:bg-surface-subtle/30">';
        cells.forEach(c => tableHtml += `<td class="border border-surface-border px-3 py-2 text-slate-300">${c}</td>`);
        tableHtml += '</tr>';
      }
    });
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Inline formatting
  // Bold: **text**
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

  // Italic: *text*
  html = html.replace(/\*([^\*]+)\*/g, '<em class="italic text-slate-200">$1</em>');

  // Strikethrough: ~~text~~
  html = html.replace(/~~([^~]+)~~/g, '<s class="line-through text-slate-400">$1</s>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#1e293b] text-blue-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-surface-border/50">$1</code>');

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg border border-surface-border my-4 max-w-full shadow-md" />');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline underline-offset-2">$1</a>');

  // Paragraphs for remaining text blocks
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<table') || p.startsWith('<blockquote') || p.startsWith('<hr') || p.startsWith('<li')) {
      return p;
    }
    return `<p class="my-2.5 leading-relaxed text-slate-300">${p}</p>`;
  }).join('\n');

  return html;
}

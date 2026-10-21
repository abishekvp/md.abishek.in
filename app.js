/**
 * Markdown Studio Pro — Fullscreen GFM, KaTeX & Mermaid Application
 */

// ================= THEME & SUITE SWITCHER =================
const themeToggle = document.getElementById('themeToggle');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const switcherBtn = document.getElementById('switcherBtn');
const switcherMenu = document.getElementById('switcherMenu');
const btnExportMenu = document.getElementById('btnExportMenu');
const exportMenu = document.getElementById('exportMenu');

const savedTheme = localStorage.getItem('md_theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-theme');
  if (isDark) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('md_theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('md_theme', 'dark');
  }
});

fullscreenToggle?.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    document.body.classList.add('fullscreen-mode');
  } else {
    document.exitFullscreen().catch(() => {});
    document.body.classList.remove('fullscreen-mode');
  }
});

function closeAllDropdowns() {
  switcherMenu?.classList.remove('show');
  exportMenu?.classList.remove('show');
}

switcherBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const show = switcherMenu.classList.contains('show');
  closeAllDropdowns();
  if (!show) switcherMenu.classList.add('show');
});

btnExportMenu?.addEventListener('click', (e) => {
  e.stopPropagation();
  const show = exportMenu.classList.contains('show');
  closeAllDropdowns();
  if (!show) exportMenu.classList.add('show');
});

document.addEventListener('click', closeAllDropdowns);

// ================= VIEW MODES & SYNC SCROLL =================
const viewButtons = document.querySelectorAll('.view-btn');
const syncScrollCheck = document.getElementById('syncScrollCheck');
const mdTextarea = document.getElementById('mdTextarea');
const previewInner = document.getElementById('previewContent');
const mdLines = document.getElementById('mdLines');

viewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    viewButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    document.body.classList.remove('view-split', 'view-editor', 'view-preview');
    document.body.classList.add(`view-${view}`);
  });
});

// Synchronized scrolling
let isSyncingEditor = false;
let isSyncingPreview = false;

mdTextarea?.addEventListener('scroll', () => {
  mdLines.scrollTop = mdTextarea.scrollTop;

  if (!syncScrollCheck.checked || isSyncingEditor) return;
  isSyncingPreview = true;
  const percentage = mdTextarea.scrollTop / (mdTextarea.scrollHeight - mdTextarea.clientHeight);
  previewInner.scrollTop = percentage * (previewInner.scrollHeight - previewInner.clientHeight);
  setTimeout(() => isSyncingPreview = false, 50);
});

previewInner?.addEventListener('scroll', () => {
  if (!syncScrollCheck.checked || isSyncingPreview) return;
  isSyncingEditor = true;
  const percentage = previewInner.scrollTop / (previewInner.scrollHeight - previewInner.clientHeight);
  mdTextarea.scrollTop = percentage * (mdTextarea.scrollHeight - mdTextarea.clientHeight);
  mdLines.scrollTop = mdTextarea.scrollTop;
  setTimeout(() => isSyncingEditor = false, 50);
});

// Line numbers update
function updateLineNumbers() {
  const lineCount = (mdTextarea.value || '').split('\n').length;
  let html = '';
  for (let i = 1; i <= lineCount; i++) {
    html += `<div>${i}</div>`;
  }
  mdLines.innerHTML = html;
}

// ================= TABLE OF CONTENTS (TOC) OUTLINE =================
const tocSidebar = document.getElementById('tocSidebar');
const btnToggleToc = document.getElementById('btnToggleToc');
const btnCloseToc = document.getElementById('btnCloseToc');
const tocContent = document.getElementById('tocContent');

btnToggleToc?.addEventListener('click', () => {
  tocSidebar.classList.toggle('show');
});

btnCloseToc?.addEventListener('click', () => {
  tocSidebar.classList.remove('show');
});

function updateToc(headings) {
  if (!headings || headings.length === 0) {
    tocContent.innerHTML = '<div class="toc-empty">No headings found in document yet.</div>';
    return;
  }

  tocContent.innerHTML = '';
  headings.forEach(h => {
    const item = document.createElement('a');
    item.className = `toc-item toc-h${h.level}`;
    item.textContent = h.text;
    item.href = `#${h.id}`;
    item.onclick = (e) => {
      e.preventDefault();
      const el = document.getElementById(h.id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    tocContent.appendChild(item);
  });
}

// ================= GFM, KATEX & MERMAID RENDERER =================
// Initialize Mermaid
if (typeof mermaid !== 'undefined') {
  mermaid.initialize({ startOnLoad: false, theme: 'dark' });
}

let headingsList = [];

// Custom Marked Renderer
const renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  const cleanId = text.toLowerCase().replace(/[^\w]+/g, '-');
  headingsList.push({ id: cleanId, text: text, level: level });
  return `<h${level} id="${cleanId}">${text}</h${level}>`;
};

renderer.code = function (code, lang) {
  if (lang === 'mermaid') {
    return `<div class="mermaid-wrapper"><div class="mermaid">${code}</div></div>`;
  }

  const safeLang = lang || 'text';
  const escapedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span>${safeLang}</span>
        <button class="copy-code-btn" onclick="copyCodeSnippet(this)">Copy</button>
      </div>
      <pre><code class="language-${safeLang}">${escapedCode}</code></pre>
    </div>
  `;
};

window.copyCodeSnippet = function (btn) {
  const pre = btn.closest('.code-block-wrapper').querySelector('pre');
  if (pre) {
    navigator.clipboard.writeText(pre.innerText);
    const prev = btn.textContent;
    btn.textContent = '✓ Copied';
    setTimeout(() => btn.textContent = prev, 1500);
  }
};

marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true
});

function renderMarkdown() {
  const raw = mdTextarea.value;
  headingsList = [];

  // Parse KaTeX math equations
  // Replace display equations $$...$$
  let processed = raw.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try {
      if (typeof katex !== 'undefined') {
        return `<div class="katex-display">${katex.renderToString(formula, { displayMode: true })}</div>`;
      }
    } catch (e) {
      return `<div style="color:var(--danger)">Math Error: ${e.message}</div>`;
    }
    return match;
  });

  // Replace inline equations $...$
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
    try {
      if (typeof katex !== 'undefined') {
        return katex.renderToString(formula, { displayMode: false });
      }
    } catch (e) {
      return match;
    }
    return match;
  });

  // Parse Markdown with Marked
  const html = marked.parse(processed);
  previewInner.innerHTML = html;

  // Render Mermaid diagrams
  if (typeof mermaid !== 'undefined') {
    const mermaidNodes = previewInner.querySelectorAll('.mermaid');
    if (mermaidNodes.length > 0) {
      mermaid.run({ nodes: mermaidNodes }).catch(() => {});
    }
  }

  // Update TOC
  updateToc(headingsList);

  // Update Metrics
  updateWritingStats(raw);
  updateLineNumbers();
  localStorage.setItem('markdown_draft', raw);
}

// ================= WRITING METRICS =================
const wordCountEl = document.getElementById('wordCount');
const charCountEl = document.getElementById('charCount');
const readTimeEl = document.getElementById('readTime');
const lineCountEl = document.getElementById('lineCount');

function updateWritingStats(text) {
  const words = (text.trim().match(/\S+/g) || []).length;
  const chars = text.length;
  const lines = text.split('\n').length;
  const minutes = Math.ceil(words / 200);

  wordCountEl.textContent = words.toLocaleString();
  charCountEl.textContent = chars.toLocaleString();
  lineCountEl.textContent = lines.toLocaleString();
  readTimeEl.textContent = `${minutes} min read`;
}

// ================= FORMATTING TOOLBAR =================
function insertSyntax(before, after = '', defaultText = '') {
  const start = mdTextarea.selectionStart;
  const end = mdTextarea.selectionEnd;
  const text = mdTextarea.value;

  const selection = text.substring(start, end) || defaultText;
  const replacement = before + selection + after;

  mdTextarea.value = text.substring(0, start) + replacement + text.substring(end);
  mdTextarea.selectionStart = start + before.length;
  mdTextarea.selectionEnd = start + before.length + selection.length;
  mdTextarea.focus();
  renderMarkdown();
}

document.querySelectorAll('.tool-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    switch (action) {
      case 'h1': insertSyntax('# ', '', 'Heading 1'); break;
      case 'h2': insertSyntax('## ', '', 'Heading 2'); break;
      case 'h3': insertSyntax('### ', '', 'Heading 3'); break;
      case 'bold': insertSyntax('**', '**', 'bold text'); break;
      case 'italic': insertSyntax('*', '*', 'italic text'); break;
      case 'strike': insertSyntax('~~', '~~', 'strikethrough'); break;
      case 'quote': insertSyntax('> ', '', 'Quoted paragraph'); break;
      case 'inline-code': insertSyntax('`', '`', 'code'); break;
      case 'code-block': insertSyntax('```javascript\n', '\n```', '// Your code here'); break;
      case 'ul': insertSyntax('- ', '', 'Bullet item'); break;
      case 'ol': insertSyntax('1. ', '', 'Numbered item'); break;
      case 'task': insertSyntax('- [ ] ', '', 'Task item'); break;
      case 'table': insertSyntax('\n| Feature | Status | Notes |\n| :--- | :---: | :--- |\n| Speed | High | Optimized |\n| Memory | Low | Efficient |\n\n'); break;
      case 'link': insertSyntax('[', '](https://example.com)', 'link text'); break;
      case 'image': insertSyntax('![', '](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800)', 'Alt text'); break;
      case 'math': insertSyntax('$$\n\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}\n$$\n'); break;
      case 'mermaid': insertSyntax('```mermaid\ngraph TD;\n  A[Start] --> B{Process};\n  B -->|Yes| C[Approved];\n  B -->|No| D[Rejected];\n```\n'); break;
      case 'hr': insertSyntax('\n---\n'); break;
    }
  });
});

// Clear editor
document.getElementById('btnClearEditor')?.addEventListener('click', () => {
  if (confirm('Clear all markdown text in the editor?')) {
    mdTextarea.value = '';
    renderMarkdown();
  }
});

// File upload (.md, .txt)
const mdFileInput = document.getElementById('mdFileInput');
mdFileInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    mdTextarea.value = evt.target.result;
    renderMarkdown();
  };
  reader.readAsText(file);
});

// Keyboard shortcuts (Ctrl+B, Ctrl+I)
mdTextarea?.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'b') {
    e.preventDefault();
    insertSyntax('**', '**', 'bold text');
  } else if (e.ctrlKey && e.key === 'i') {
    e.preventDefault();
    insertSyntax('*', '*', 'italic text');
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const start = mdTextarea.selectionStart;
    const end = mdTextarea.selectionEnd;
    mdTextarea.value = mdTextarea.value.substring(0, start) + '  ' + mdTextarea.value.substring(end);
    mdTextarea.selectionStart = mdTextarea.selectionEnd = start + 2;
    renderMarkdown();
  }
});

mdTextarea?.addEventListener('input', renderMarkdown);

// ================= EXPORT ACTIONS =================
const btnDownloadMd = document.getElementById('btnDownloadMd');
const btnCopyHtml = document.getElementById('btnCopyHtml');
const btnDownloadHtml = document.getElementById('btnDownloadHtml');
const btnPrintPdf = document.getElementById('btnPrintPdf');

btnDownloadMd?.addEventListener('click', () => {
  const blob = new Blob([mdTextarea.value], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'document.md';
  a.click();
});

btnCopyHtml?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(previewInner.innerHTML);
  alert('Rendered HTML copied to clipboard!');
});

btnDownloadHtml?.addEventListener('click', () => {
  const completeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Exported Document</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    pre { background: #0f172a; color: #f8fafc; padding: 14px; border-radius: 8px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
    th { background: #f1f5f9; }
    blockquote { border-left: 4px solid #3b82f6; padding: 8px 16px; background: #f8fafc; margin: 16px 0; }
  </style>
</head>
<body>
  ${previewInner.innerHTML}
</body>
</html>`;
  const blob = new Blob([completeHtml], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'document.html';
  a.click();
});

btnPrintPdf?.addEventListener('click', () => {
  window.print();
});

// ================= CHEAT SHEET MODAL =================
const cheatSheetModal = document.getElementById('cheatSheetModal');
const btnCheatSheet = document.getElementById('btnCheatSheet');
const btnCloseCheat = document.getElementById('btnCloseCheat');

btnCheatSheet?.addEventListener('click', () => cheatSheetModal.classList.add('show'));
btnCloseCheat?.addEventListener('click', () => cheatSheetModal.classList.remove('show'));

// ================= HTML TO MARKDOWN CONVERTER =================
const htmlModal = document.getElementById('htmlModal');
const btnOpenHtmlConverter = document.getElementById('btnOpenHtmlConverter');
const btnCloseHtmlModal = document.getElementById('btnCloseHtmlModal');
const btnCancelHtmlModal = document.getElementById('btnCancelHtmlModal');
const btnConvertHtmlToMd = document.getElementById('btnConvertHtmlToMd');
const rawHtmlInput = document.getElementById('rawHtmlInput');

btnOpenHtmlConverter?.addEventListener('click', () => htmlModal.classList.add('show'));
[btnCloseHtmlModal, btnCancelHtmlModal].forEach(b => b?.addEventListener('click', () => htmlModal.classList.remove('show')));

function htmlToMarkdown(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  function nodeToMd(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();
    const children = Array.from(node.childNodes).map(nodeToMd).join('');

    switch (tag) {
      case 'h1': return `\n# ${children}\n\n`;
      case 'h2': return `\n## ${children}\n\n`;
      case 'h3': return `\n### ${children}\n\n`;
      case 'p': return `\n${children}\n\n`;
      case 'b': case 'strong': return `**${children}**`;
      case 'i': case 'em': return `*${children}*`;
      case 's': case 'strike': return `~~${children}~~`;
      case 'a': return `[${children}](${node.getAttribute('href') || ''})`;
      case 'img': return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src') || ''})`;
      case 'code': return `\`${children}\``;
      case 'pre': return `\n\`\`\`\n${children}\n\`\`\`\n\n`;
      case 'blockquote': return `\n> ${children}\n\n`;
      case 'li': return `- ${children}\n`;
      case 'ul': case 'ol': return `\n${children}\n`;
      case 'hr': return `\n---\n\n`;
      default: return children;
    }
  }

  return nodeToMd(doc.body).replace(/\n{3,}/g, '\n\n').trim();
}

btnConvertHtmlToMd?.addEventListener('click', () => {
  const html = rawHtmlInput.value;
  if (!html.trim()) return;
  const md = htmlToMarkdown(html);
  mdTextarea.value = (mdTextarea.value ? mdTextarea.value + '\n\n' : '') + md;
  renderMarkdown();
  htmlModal.classList.remove('show');
  rawHtmlInput.value = '';
});

// ================= SAMPLE DOCUMENT =================
const SAMPLE_DOC = `# Welcome to Markdown Studio Pro 🚀

A comprehensive, fullscreen **GitHub Flavored Markdown (GFM)** workspace featuring live preview, KaTeX mathematical typesetting, and Mermaid diagram visualizers.

---

## ⚡ Core Features

- **Split Screen Mode:** Real-time synchronized scroll with zero latency.
- **GFM Compliant:** Tables, interactive task lists, and syntax-highlighted code.
- **LaTeX Math Engine:** High-performance formulas powered by KaTeX.
- **Mermaid Diagrams:** Declarative charts rendered into crisp vector graphics.
- **Export Ready:** One-click download as \`.md\`, clean \`.html\`, or Print to PDF.

---

## 📊 Interactive Mermaid Diagrams

\`\`\`mermaid
graph TD;
  A[💡 Idea / Feature Request] --> B(Review & Prioritize);
  B --> C{Approved?};
  C -->|Yes| D[🚀 Deploy to Production];
  C -->|No| E[Archive in Backlog];
\`\`\`

---

## 📐 Mathematical Formulas (KaTeX)

Euler's identity, often described as the most beautiful formula in mathematics:

$$e^{i\\pi} + 1 = 0$$

Gaussian probability distribution integral:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

---

## 💻 Code Blocks with Copy Snippet

\`\`\`javascript
// High-performance asynchronous function
async function fetchToolData(subdomain) {
  const response = await fetch(\`https://\${subdomain}/api/status\`);
  const data = await response.json();
  console.log('Operational status:', data.status);
  return data;
}
\`\`\`

---

## ⊞ Feature Comparison Table

| Tool Name | Subdomain | Primary Focus | Status |
| :--- | :--- | :--- | :---: |
| **Base64 Studio** | \`base64.abishek.in\` | Encoders, Decoders & File Data URIs | ✅ Live |
| **Web Compiler** | \`compiler.abishek.in\` | HTML/CSS/JS Sandbox & IDE | ✅ Live |
| **JSON Master** | \`json.abishek.in\` | Formatter, Repair & Converters | ✅ Live |
| **Markdown Studio** | \`md.abishek.in\` | GFM Editor, Math & Diagrams | ✅ Live |
| **Prettier Studio** | \`prettier.abishek.in\` | Multi-language Code Formatter | ✅ Live |

---

## ☑ Interactive Task Checklist

- [x] Fullscreen responsive split-screen layout
- [x] Auto-saved draft in browser LocalStorage
- [x] Interactive Table of Contents sidebar
- [ ] Share document via cloud URL
`;

const btnSampleDoc = document.getElementById('btnSampleDoc');
btnSampleDoc?.addEventListener('click', () => {
  if (confirm('Load sample document? This will replace the current editor content.')) {
    mdTextarea.value = SAMPLE_DOC;
    renderMarkdown();
  }
});

// Initial Load
const savedDraft = localStorage.getItem('markdown_draft');
if (savedDraft) {
  mdTextarea.value = savedDraft;
} else {
  mdTextarea.value = SAMPLE_DOC;
}

renderMarkdown();

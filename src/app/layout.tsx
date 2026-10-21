import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Markdown Studio Pro — Fullscreen GFM Editor, KaTeX Math & Mermaid Diagrams | abishek.in',
  description: 'Professional fullscreen Markdown studio: GitHub Flavored Markdown (GFM), live synced preview, KaTeX math rendering, interactive Mermaid diagrams, table generator, HTML to Markdown converter, and PDF export.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📝</text></svg>" />
      </head>
      <body className="bg-surface-darker text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}

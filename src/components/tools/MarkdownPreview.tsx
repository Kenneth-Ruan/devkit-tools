'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { parseMarkdown } from '@/lib/transforms';
import SplitPane from '@/components/SplitPane';

const SAMPLE = `# Hello, Markdown!

Write your **markdown** here and see it rendered *live*.

## Features

- Lists work great
- \`inline code\` too
- And [links](https://example.com)

\`\`\`js
const hello = "world";
console.log(hello);
\`\`\`

> Blockquotes look nice too.
`;

const CHEATSHEET = [
  { syntax: '# H1  ## H2  ### H3', desc: 'Headings' },
  { syntax: '**bold**', desc: 'Bold' },
  { syntax: '*italic*', desc: 'Italic' },
  { syntax: '~~strikethrough~~', desc: 'Strikethrough' },
  { syntax: '`inline code`', desc: 'Inline code' },
  { syntax: '```lang\n...\n```', desc: 'Code block' },
  { syntax: '[text](url)', desc: 'Link' },
  { syntax: '![alt](url)', desc: 'Image' },
  { syntax: '- item  * item', desc: 'Unordered list' },
  { syntax: '1. item', desc: 'Ordered list' },
  { syntax: '> quote', desc: 'Blockquote' },
  { syntax: '---', desc: 'Horizontal rule' },
  { syntax: '| Col | Col |\n|-----|-----|\n| A   | B   |', desc: 'Table' },
  { syntax: '- [ ] todo  - [x] done', desc: 'Task list' },
];

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [html, setHtml] = useState('');
  const [syncScroll, setSyncScroll] = useState(true);
  const [showCheat, setShowCheat] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    setHtml(parseMarkdown(input));
  }, [input]);

  const onEditorScroll = useCallback(() => {
    if (!syncScroll || isSyncingRef.current || !textareaRef.current || !previewRef.current) return;
    isSyncingRef.current = true;
    const el = textareaRef.current;
    const ratio = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    const prev = previewRef.current;
    prev.scrollTop = ratio * (prev.scrollHeight - prev.clientHeight);
    requestAnimationFrame(() => { isSyncingRef.current = false; });
  }, [syncScroll]);

  const onPreviewScroll = useCallback(() => {
    if (!syncScroll || isSyncingRef.current || !textareaRef.current || !previewRef.current) return;
    isSyncingRef.current = true;
    const prev = previewRef.current;
    const ratio = prev.scrollTop / Math.max(1, prev.scrollHeight - prev.clientHeight);
    const el = textareaRef.current;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
    requestAnimationFrame(() => { isSyncingRef.current = false; });
  }, [syncScroll]);

  function exportHtml() {
    const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exported Markdown</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
  pre { background: #f1f5f9; padding: 1em; border-radius: 6px; overflow-x: auto; }
  code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 1em; color: #64748b; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #e2e8f0; padding: 8px 12px; }
  th { background: #f8fafc; }
  img { max-width: 100%; }
</style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const leftPanel = (
    <div className="flex flex-col h-full">
      <label className="text-xs text-slate-500 mb-1">Markdown</label>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onScroll={onEditorScroll}
        className="tool-textarea flex-1"
        style={{ resize: 'none' }}
        placeholder="# Hello, World!"
      />
    </div>
  );

  const rightPanel = (
    <div className="flex flex-col h-full">
      <label className="text-xs text-slate-500 mb-1">Preview</label>
      <div
        ref={previewRef}
        onScroll={onPreviewScroll}
        className="flex-1 bg-[#1a1d27] border border-[#2a2d3a] rounded-lg p-4 overflow-auto prose prose-invert prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => setSyncScroll((v) => !v)} className={syncScroll ? 'btn-primary' : 'btn-secondary'} title="Sync scroll position between editor and preview">
          Sync Scroll
        </button>
        <button onClick={exportHtml} className="btn-secondary ml-auto">Export HTML</button>
      </div>

      <SplitPane className="h-[calc(100vh-260px)]" left={leftPanel} right={rightPanel} />

      <div>
        <button onClick={() => setShowCheat((v) => !v)} className={showCheat ? 'btn-primary' : 'btn-secondary'}>
          {showCheat ? 'Hide Cheatsheet' : 'Syntax Cheatsheet'}
        </button>
        {showCheat && (
          <div className="mt-3 bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#2a2d3a] text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Markdown Syntax Reference
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {CHEATSHEET.map(({ syntax, desc }) => (
                <div key={desc} className="flex items-start gap-3 px-4 py-3 border-b border-r border-[#2a2d3a] hover:bg-[#2a2d3a]/40">
                  <code className="text-xs text-indigo-300 font-mono whitespace-pre shrink-0">{syntax}</code>
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

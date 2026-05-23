'use client';
import { useState, useEffect } from 'react';
import { marked } from 'marked';

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
  { syntax: '```lang\\n...\\n```', desc: 'Code block' },
  { syntax: '[text](url)', desc: 'Link' },
  { syntax: '![alt](url)', desc: 'Image' },
  { syntax: '- item  * item', desc: 'Unordered list' },
  { syntax: '1. item', desc: 'Ordered list' },
  { syntax: '> quote', desc: 'Blockquote' },
  { syntax: '---', desc: 'Horizontal rule' },
  { syntax: '| Col | Col |\\n|-----|-----|\\n| A   | B   |', desc: 'Table' },
  { syntax: '- [ ] todo  - [x] done', desc: 'Task list' },
];

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [html, setHtml] = useState('');
  const [showCheat, setShowCheat] = useState(false);

  useEffect(() => {
    setHtml(marked(input) as string);
  }, [input]);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCheat((v) => !v)} className={showCheat ? 'btn-primary' : 'btn-secondary'}>
          {showCheat ? 'Hide Cheatsheet' : 'Syntax Cheatsheet'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: 'calc(100vh - 240px)' }}>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Markdown</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="tool-textarea flex-1"
            style={{ resize: 'none' }}
            placeholder="# Hello, World!"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Preview</label>
          <div
            className="flex-1 bg-[#1a1d27] border border-[#2a2d3a] rounded-lg p-4 overflow-auto prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {showCheat && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#2a2d3a] text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Markdown Syntax Reference
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
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
  );
}

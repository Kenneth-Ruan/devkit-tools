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

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(marked(input) as string);
  }, [input]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: 'calc(100vh - 200px)' }}>
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
  );
}

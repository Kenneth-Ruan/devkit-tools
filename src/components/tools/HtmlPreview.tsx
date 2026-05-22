'use client';
import { useState } from 'react';

const SAMPLE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    h1 { color: #6366f1; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Edit the HTML on the left to see it rendered here.</p>
</body>
</html>`;

export default function HtmlPreview() {
  const [input, setInput] = useState(SAMPLE);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: 'calc(100vh - 200px)' }}>
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">HTML</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="tool-textarea flex-1" style={{ resize: 'none' }} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Preview</label>
        <iframe
          srcDoc={input}
          className="flex-1 rounded-lg border border-[#2a2d3a] bg-white"
          sandbox="allow-scripts"
          title="HTML Preview"
        />
      </div>
    </div>
  );
}

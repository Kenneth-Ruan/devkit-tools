'use client';
import { useState } from 'react';
import SplitPane from '@/components/SplitPane';

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

const CHEATSHEET = [
  { tag: '<h1> – <h6>', desc: 'Headings (h1 largest)' },
  { tag: '<p>', desc: 'Paragraph' },
  { tag: '<a href="url">', desc: 'Hyperlink' },
  { tag: '<img src="url" alt="">', desc: 'Image' },
  { tag: '<div>', desc: 'Block-level container' },
  { tag: '<span>', desc: 'Inline container' },
  { tag: '<ul> / <ol> / <li>', desc: 'Unordered / ordered list' },
  { tag: '<table> <tr> <th> <td>', desc: 'Table structure' },
  { tag: '<form> <input> <button>', desc: 'Form elements' },
  { tag: '<strong>', desc: 'Bold (semantic)' },
  { tag: '<em>', desc: 'Italic (semantic)' },
  { tag: '<code>', desc: 'Inline code' },
  { tag: '<pre>', desc: 'Preformatted text' },
  { tag: '<br>', desc: 'Line break' },
  { tag: '<hr>', desc: 'Horizontal rule' },
  { tag: '<header> <nav> <main> <footer>', desc: 'Semantic layout' },
  { tag: '<section> <article> <aside>', desc: 'Content sections' },
  { tag: '<script src=""> / <style>', desc: 'JS / CSS resources' },
  { tag: '<meta name="" content="">', desc: 'Metadata (in <head>)' },
  { tag: '<link rel="stylesheet" href="">', desc: 'External stylesheet' },
  { tag: '<select> <option>', desc: 'Dropdown' },
  { tag: '<textarea rows="" cols="">', desc: 'Multiline text input' },
  { tag: '<label for="">', desc: 'Form label' },
  { tag: '<canvas>', desc: 'Drawing surface (JS)' },
];

export default function HtmlPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [showCheat, setShowCheat] = useState(false);

  return (
    <div className="space-y-3">
      <SplitPane
        className="h-[calc(100vh-220px)]"
        left={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1">HTML</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="tool-textarea flex-1" style={{ resize: 'none' }} />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1">Preview</label>
            <iframe
              srcDoc={input}
              className="flex-1 rounded-lg border border-[#2a2d3a] bg-white"
              sandbox="allow-scripts"
              title="HTML Preview"
            />
          </div>
        }
      />

      <div>
        <button onClick={() => setShowCheat((v) => !v)} className={showCheat ? 'btn-primary' : 'btn-secondary'}>
          {showCheat ? 'Hide Cheatsheet' : 'HTML Cheatsheet'}
        </button>
        {showCheat && (
          <div className="mt-3 bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#2a2d3a] text-xs font-semibold text-slate-400 uppercase tracking-wider">
              HTML Tag Reference
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {CHEATSHEET.map(({ tag, desc }) => (
                <div key={tag} className="flex items-start gap-3 px-4 py-3 border-b border-r border-[#2a2d3a] hover:bg-[#2a2d3a]/40">
                  <code className="text-xs text-indigo-300 font-mono shrink-0">{tag}</code>
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

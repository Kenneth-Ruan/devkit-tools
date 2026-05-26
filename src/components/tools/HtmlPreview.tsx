'use client';
import { useState } from 'react';
import SplitPane from '@/components/SplitPane';

const DEFAULT_HTML = `<h1>Hello, World!</h1>
<p>Edit HTML, CSS, and JS in the tabs on the left.</p>
<button id="btn">Click me</button>`;

const DEFAULT_CSS = `body {
  font-family: sans-serif;
  padding: 20px;
  background: #f8fafc;
}
h1 { color: #6366f1; }
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover { background: #4f46e5; }`;

const DEFAULT_JS = `document.getElementById('btn').addEventListener('click', () => {
  alert('Hello from JS!');
});`;

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

const VIEWPORTS = [
  { label: 'Full', icon: '🖥', width: '100%' },
  { label: 'Tablet', icon: '📱', width: '768px' },
  { label: 'Mobile', icon: '📲', width: '375px' },
];

type Tab = 'html' | 'css' | 'js';

const TAB_COLORS: Record<Tab, string> = {
  html: 'text-orange-400',
  css: 'text-blue-400',
  js: 'text-yellow-400',
};

export default function HtmlPreview() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [tab, setTab] = useState<Tab>('html');
  const [viewport, setViewport] = useState('100%');
  const [showCheat, setShowCheat] = useState(false);

  const srcdoc = `<!DOCTYPE html>\n<html>\n<head>\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n<script>\n${js}\n<\/script>\n</body>\n</html>`;

  const leftPanel = (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 mb-2">
        {(['html', 'css', 'js'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded text-xs font-mono font-semibold transition ${
              tab === t
                ? `bg-[#2a2d3a] ${TAB_COLORS[t]}`
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      {tab === 'html' && (
        <textarea value={html} onChange={(e) => setHtml(e.target.value)}
          className="tool-textarea flex-1" style={{ resize: 'none' }} placeholder="<p>HTML here</p>" />
      )}
      {tab === 'css' && (
        <textarea value={css} onChange={(e) => setCss(e.target.value)}
          className="tool-textarea flex-1" style={{ resize: 'none' }} placeholder="body { }" />
      )}
      {tab === 'js' && (
        <textarea value={js} onChange={(e) => setJs(e.target.value)}
          className="tool-textarea flex-1" style={{ resize: 'none' }} placeholder="console.log('hello')" />
      )}
    </div>
  );

  const rightPanel = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs text-slate-500 mr-1">Preview</span>
        <div className="flex gap-1 ml-auto">
          {VIEWPORTS.map((v) => (
            <button
              key={v.label}
              onClick={() => setViewport(v.width)}
              title={v.label}
              className={`px-2 py-0.5 rounded text-xs transition ${
                viewport === v.width ? 'bg-indigo-600 text-white' : 'bg-[#1a1d27] text-slate-400 hover:text-white border border-[#2a2d3a]'
              }`}
            >
              {v.icon}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex justify-center bg-[#0a0c12] border border-[#2a2d3a] rounded-lg overflow-auto">
        <iframe
          key={srcdoc}
          srcDoc={srcdoc}
          className="h-full bg-white transition-all"
          style={{ width: viewport, minHeight: '100%' }}
          sandbox="allow-scripts"
          title="HTML Preview"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <SplitPane className="h-[calc(100vh-220px)]" left={leftPanel} right={rightPanel} />

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

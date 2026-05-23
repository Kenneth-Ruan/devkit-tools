'use client';
import { useState } from 'react';
import { minifyHtml } from '@/lib/transforms';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  async function format() {
    try {
      const { html: beautify } = await import('js-beautify');
      setOutput(beautify(input, { indent_size: indent, max_preserve_newlines: 1 }));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function minify() {
    setOutput(minifyHtml(input));
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={format} className="btn-primary">Format HTML</button>
        <button onClick={minify} className="btn-secondary">Minify</button>
        <div className="flex items-center gap-2 ml-2">
          <label className="text-xs text-slate-500">Indent:</label>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)}
              className={`px-3 py-1 rounded text-sm ${indent === n ? 'btn-primary' : 'btn-secondary'}`}>{n}</button>
          ))}
        </div>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input HTML</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={20}
            placeholder="<div><p>Hello</p></div>" className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          {error ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={20} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

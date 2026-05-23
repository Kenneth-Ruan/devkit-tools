'use client';
import { useState, useEffect } from 'react';
import { minifyHtml } from '@/lib/transforms';
import SplitPane from '@/components/SplitPane';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState(2);

  useEffect(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    if (mode === 'minify') { setOutput(minifyHtml(input)); setError(''); return; }
    let cancelled = false;
    import('js-beautify').then(({ html: beautify }) => {
      if (!cancelled) { setOutput(beautify(input, { indent_size: indent, max_preserve_newlines: 1 })); setError(''); }
    }).catch((e) => { if (!cancelled) setError((e as Error).message); });
    return () => { cancelled = true; };
  }, [input, mode, indent]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={() => setMode('format')} className={mode === 'format' ? 'btn-primary' : 'btn-secondary'}>Format</button>
        <button onClick={() => setMode('minify')} className={mode === 'minify' ? 'btn-primary' : 'btn-secondary'}>Minify</button>
        {mode === 'format' && (
          <div className="flex items-center gap-2 ml-2">
            <label className="text-xs text-slate-500">Indent:</label>
            {[2, 4].map((n) => (
              <button key={n} onClick={() => setIndent(n)}
                className={`px-3 py-1 rounded text-sm ${indent === n ? 'btn-primary' : 'btn-secondary'}`}>{n}</button>
            ))}
          </div>
        )}
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Input HTML</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={20}
              placeholder="<div><p>Hello</p></div>" className="tool-textarea" />
          </div>
        }
        right={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Output</label>
            {error
              ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
              : <textarea readOnly value={output} rows={20} className="tool-textarea opacity-80" />}
          </div>
        }
      />
    </div>
  );
}

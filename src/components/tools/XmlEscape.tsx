'use client';
import { useState, useMemo } from 'react';
import { xmlEscape, xmlUnescape } from '@/lib/transforms';

export default function XmlEscape() {
  const [input, setInput] = useState('<price currency="USD">5 > 3 & 2 < 4</price>');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      const out = mode === 'escape' ? xmlEscape(input) : xmlUnescape(input);
      return { output: out, error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button onClick={() => setMode('escape')} className={mode === 'escape' ? 'btn-primary' : 'btn-secondary'}>Escape</button>
        <button onClick={() => setMode('unescape')} className={mode === 'unescape' ? 'btn-primary' : 'btn-secondary'}>Unescape</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">
          {mode === 'escape' ? 'Raw text (contains < > & " \')' : 'XML-escaped text'}
        </label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          rows={8} className="tool-textarea" />
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">
          {mode === 'escape' ? 'XML-escaped (safe to embed in XML content)' : 'Unescaped text'}
        </label>
        {error ? (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
        ) : (
          <textarea readOnly value={output} rows={8} className="tool-textarea opacity-80" />
        )}
      </div>

      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-lg p-3 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">XML escape reference</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 font-mono">
          {[['&', '&amp;'], ['<', '&lt;'], ['>', '&gt;'], ['"', '&quot;'], ["'", '&apos;']].map(([char, esc]) => (
            <span key={char}><span className="text-yellow-400">{char}</span> → <span className="text-indigo-300">{esc}</span></span>
          ))}
        </div>
      </div>
    </div>
  );
}

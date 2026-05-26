'use client';
import { useState, useMemo } from 'react';
import { jsonEscapeString, jsonUnescapeString } from '@/lib/transforms';

export default function JsonEscape() {
  const [input, setInput] = useState('Hello "world"\nTab:\there\nBackslash: \\');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      const out = mode === 'escape' ? jsonEscapeString(input) : jsonUnescapeString(input);
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
          {mode === 'escape' ? 'Raw string (with real newlines, quotes, etc.)' : 'JSON-escaped string'}
        </label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          rows={8} className="tool-textarea" placeholder={mode === 'escape' ? 'Hello "world"\nNew line here' : 'Hello \\"world\\"\\nNew line here'} />
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">
          {mode === 'escape' ? 'JSON-escaped (safe to embed in a JSON string value)' : 'Unescaped string'}
        </label>
        {error ? (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
        ) : (
          <textarea readOnly value={output} rows={8} className="tool-textarea opacity-80" />
        )}
      </div>

      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-lg p-3 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">Common escape sequences</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 font-mono">
          {[['\\n', 'newline'], ['\\t', 'tab'], ['\\r', 'carriage return'], ['\\"', 'double quote'], ['\\\\', 'backslash'], ['\\/', 'forward slash']].map(([esc, desc]) => (
            <span key={esc}><span className="text-indigo-300">{esc}</span> — {desc}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

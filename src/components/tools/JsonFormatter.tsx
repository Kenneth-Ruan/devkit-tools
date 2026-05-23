'use client';
import { useState, useMemo } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState(2);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const parsed = JSON.parse(input);
      return { output: mode === 'format' ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, indent]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => setMode('format')} className={mode === 'format' ? 'btn-primary' : 'btn-secondary'}>Format</button>
        <button onClick={() => setMode('minify')} className={mode === 'minify' ? 'btn-primary' : 'btn-secondary'}>Minify</button>
        {mode === 'format' && (
          <label className="text-sm text-slate-400 flex items-center gap-2">
            Indent:
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-[#1a1d27] border border-[#2a2d3a] rounded px-2 py-1 text-sm text-white">
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>
          </label>
        )}
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input JSON</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18} placeholder='{"key": "value"}' className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          {error ? (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
          ) : (
            <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
          )}
        </div>
      </div>
    </div>
  );
}

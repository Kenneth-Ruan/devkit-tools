'use client';
import { useState, useMemo } from 'react';

export default function UrlEncode() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      return { output: mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input), error: '' };
    } catch {
      return { output: '', error: 'Invalid input for decoding.' };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode('encode')} className={mode === 'encode' ? 'btn-primary' : 'btn-secondary'}>Encode</button>
        <button onClick={() => setMode('decode')} className={mode === 'decode' ? 'btn-primary' : 'btn-secondary'}>Decode</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="tool-textarea"
            placeholder={mode === 'encode' ? 'hello world & more' : 'hello%20world%20%26%20more'} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          {error
            ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={14} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

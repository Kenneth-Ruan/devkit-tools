'use client';
import { useState } from 'react';

export default function Base64() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  function run() {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError('Invalid input for decoding.');
      setOutput('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode('encode')} className={mode === 'encode' ? 'btn-primary' : 'btn-secondary'}>Encode</button>
        <button onClick={() => setMode('decode')} className={mode === 'decode' ? 'btn-primary' : 'btn-secondary'}>Decode</button>
        <button onClick={run} className="btn-primary">Run</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">{mode === 'encode' ? 'Plain text' : 'Base64'}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="tool-textarea" placeholder={mode === 'encode' ? 'Hello, world!' : 'SGVsbG8sIHdvcmxkIQ=='} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">{mode === 'encode' ? 'Base64' : 'Plain text'}</label>
          {error ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={14} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';
import { jsonToTsv, tsvToJson } from '@/lib/transforms';

const SAMPLE = JSON.stringify([
  { name: 'Alice', age: 30, role: 'Engineer' },
  { name: 'Bob', age: 25, role: 'Designer' },
  { name: 'Carol', age: 35, role: 'Manager' },
], null, 2);

export default function JsonToTsv() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<'json-to-tsv' | 'tsv-to-json'>('json-to-tsv');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const out = mode === 'json-to-tsv' ? jsonToTsv(input) : tsvToJson(input);
      return { output: out, error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <button onClick={() => setMode('json-to-tsv')} className={mode === 'json-to-tsv' ? 'btn-primary' : 'btn-secondary'}>JSON → TSV</button>
        <button onClick={() => setMode('tsv-to-json')} className={mode === 'tsv-to-json' ? 'btn-primary' : 'btn-secondary'}>TSV → JSON</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{mode === 'json-to-tsv' ? 'JSON (array of objects)' : 'TSV Input'}</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1 block">{mode === 'json-to-tsv' ? 'TSV Output' : 'JSON Output'}</label>
            {error ? (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            ) : (
              <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
            )}
          </div>
        }
      />
    </div>
  );
}

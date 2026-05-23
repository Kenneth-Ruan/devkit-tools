'use client';
import { useState, useMemo } from 'react';
import { jsonToCsv, csvToJson } from '@/lib/transforms';
import SplitPane from '@/components/SplitPane';

export default function JsonToCsv() {
  const [mode, setMode] = useState<'to-csv' | 'to-json'>('to-csv');
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      return { output: mode === 'to-csv' ? jsonToCsv(input) : csvToJson(input), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode('to-csv')} className={mode === 'to-csv' ? 'btn-primary' : 'btn-secondary'}>JSON → CSV</button>
        <button onClick={() => setMode('to-json')} className={mode === 'to-json' ? 'btn-primary' : 'btn-secondary'}>CSV → JSON</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{mode === 'to-csv' ? 'JSON Array' : 'CSV'} Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
              placeholder={mode === 'to-csv'
                ? '[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
                : 'name,age\nAlice,30\nBob,25'}
              className="tool-textarea" />
          </div>
        }
        right={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{mode === 'to-csv' ? 'CSV' : 'JSON'} Output</label>
            {error
              ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
              : <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />}
          </div>
        }
      />
    </div>
  );
}

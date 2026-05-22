'use client';
import { useState } from 'react';

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '';
  const keys = Object.keys(arr[0]);
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(','), ...arr.map((row) => keys.map((k) => esc(row[k])).join(','))].join('\n');
}

function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, vals[i]?.trim() ?? '']));
  });
  return JSON.stringify(rows, null, 2);
}

export default function JsonToCsv() {
  const [mode, setMode] = useState<'to-csv' | 'to-json'>('to-csv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function convert() {
    setError('');
    try {
      setOutput(mode === 'to-csv' ? jsonToCsv(input) : csvToJson(input));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode('to-csv')} className={mode === 'to-csv' ? 'btn-primary' : 'btn-secondary'}>JSON → CSV</button>
        <button onClick={() => setMode('to-json')} className={mode === 'to-json' ? 'btn-primary' : 'btn-secondary'}>CSV → JSON</button>
        <button onClick={convert} className="btn-primary ml-2">Convert</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">{mode === 'to-csv' ? 'JSON Array' : 'CSV'} Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
            placeholder={mode === 'to-csv'
              ? '[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
              : 'name,age\nAlice,30\nBob,25'}
            className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">{mode === 'to-csv' ? 'CSV' : 'JSON'} Output</label>
          {error ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

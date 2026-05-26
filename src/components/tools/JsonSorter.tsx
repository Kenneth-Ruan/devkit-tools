'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';
import { sortJsonKeys } from '@/lib/transforms';

const SAMPLE = JSON.stringify({
  zebra: 1,
  apple: { cherry: true, banana: [3, 1, 2] },
  mango: 'fruit',
}, null, 2);

export default function JsonSorter() {
  const [input, setInput] = useState(SAMPLE);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [indent, setIndent] = useState('2');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const parsed = JSON.parse(input) as unknown;
      const sorted = sortJsonKeys(parsed, order);
      const indentVal = indent === 'tab' ? '\t' : parseInt(indent);
      return { output: JSON.stringify(sorted, null, indentVal), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, order, indent]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => setOrder('asc')} className={order === 'asc' ? 'btn-primary' : 'btn-secondary'}>A → Z</button>
        <button onClick={() => setOrder('desc')} className={order === 'desc' ? 'btn-primary' : 'btn-secondary'}>Z → A</button>
        <label className="text-sm text-slate-400 flex items-center gap-2">
          Indent:
          <select value={indent} onChange={(e) => setIndent(e.target.value)}
            className="bg-[#1a1d27] border border-[#2a2d3a] rounded px-2 py-1 text-sm text-white">
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </label>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">JSON Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} placeholder='{"key": "value"}' />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1 block">Sorted Output</label>
            <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
          </div>
        }
      />
    </div>
  );
}

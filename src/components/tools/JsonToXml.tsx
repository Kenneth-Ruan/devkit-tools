'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';
import { jsonToXml } from '@/lib/transforms';

const SAMPLE = JSON.stringify({ person: { name: 'Alice', age: 30, hobbies: ['reading', 'coding'] } }, null, 2);

export default function JsonToXml() {
  const [input, setInput] = useState(SAMPLE);
  const [rootTag, setRootTag] = useState('root');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      return { output: jsonToXml(input, rootTag || 'root'), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, rootTag]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <label className="text-sm text-slate-400 flex items-center gap-2">
          Root tag:
          <input value={rootTag} onChange={(e) => setRootTag(e.target.value)}
            className="bg-[#1a1d27] border border-[#2a2d3a] rounded px-2 py-1 text-sm text-white w-28 focus:outline-none focus:border-indigo-500"
            placeholder="root" />
        </label>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy XML</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">JSON Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} placeholder='{"key": "value"}' />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1 block">XML Output</label>
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

'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';
import { yamlToCsv } from '@/lib/transforms';

const SAMPLE = `- name: Alice
  age: 30
  role: Engineer
- name: Bob
  age: 25
  role: Designer
- name: Carol
  age: 35
  role: Manager`;

export default function YamlToCsv() {
  const [input, setInput] = useState(SAMPLE);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      return { output: yamlToCsv(input), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy CSV</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">YAML Input (array of objects)</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} placeholder="- key: value" />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1 block">CSV Output</label>
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

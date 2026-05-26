'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<people>
  <person>
    <name>Alice</name>
    <age>30</age>
    <role>Engineer</role>
  </person>
  <person>
    <name>Bob</name>
    <age>25</age>
    <role>Designer</role>
  </person>
</people>`;

function xmlToCsv(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(err.textContent?.trim() ?? 'Invalid XML');

  const root = doc.documentElement;
  const items = Array.from(root.children);
  if (!items.length) throw new Error('No child elements found under root');

  const keys = [...new Set(items.flatMap((el) => Array.from(el.children).map((c) => c.tagName)))];

  const esc = (v: string) =>
    v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v;

  const rows = items.map((el) =>
    keys.map((k) => esc(el.querySelector(k)?.textContent?.trim() ?? '')).join(',')
  );
  return [keys.join(','), ...rows].join('\n');
}

export default function XmlToCsv() {
  const [input, setInput] = useState(SAMPLE);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      return { output: xmlToCsv(input), error: '' };
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
            <label className="text-xs text-slate-500 mb-1 block">XML Input (flat list structure)</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} />
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

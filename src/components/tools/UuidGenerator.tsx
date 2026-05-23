'use client';
import { useState } from 'react';
import { generateV4 } from '@/lib/transforms';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, generateV4));
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState(false);

  function generate() {
    setUuids(Array.from({ length: count }, generateV4));
  }

  function copyAll() {
    const text = uuids.map((u) => uppercase ? u.toUpperCase() : u).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const display = uuids.map((u) => uppercase ? u.toUpperCase() : u);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Count:</label>
          <input type="number" min={1} max={50} value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-16 bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-2 py-1.5 text-sm text-slate-200 text-center" />
        </div>
        <button onClick={() => setUppercase((u) => !u)}
          className={uppercase ? 'btn-primary' : 'btn-secondary'}>
          UPPERCASE
        </button>
        <button onClick={generate} className="btn-primary">Generate</button>
        <button onClick={copyAll} className="btn-secondary ml-auto">
          {copied ? 'Copied!' : 'Copy All'}
        </button>
      </div>

      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
        {display.map((u, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group">
            <span className="text-sm font-mono text-slate-200 select-all">{u}</span>
            <button onClick={() => navigator.clipboard.writeText(u)}
              className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition ml-3">
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

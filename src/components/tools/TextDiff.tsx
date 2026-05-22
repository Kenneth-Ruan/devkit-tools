'use client';
import { useState, useMemo } from 'react';

type DiffLine = { type: 'same' | 'add' | 'remove'; text: string; lineA?: number; lineB?: number };

function diff(a: string, b: string): DiffLine[] {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const m = aLines.length, n = bLines.length;

  // Simple LCS-based diff
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = aLines[i] === bLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0, j = 0, la = 1, lb = 1;
  while (i < m || j < n) {
    if (i < m && j < n && aLines[i] === bLines[j]) {
      result.push({ type: 'same', text: aLines[i], lineA: la++, lineB: lb++ });
      i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: 'add', text: bLines[j], lineB: lb++ });
      j++;
    } else {
      result.push({ type: 'remove', text: aLines[i], lineA: la++ });
      i++;
    }
  }
  return result;
}

export default function TextDiff() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [show, setShow] = useState(false);

  const lines = useMemo(() => (show ? diff(textA, textB) : []), [show, textA, textB]);
  const adds = lines.filter((l) => l.type === 'add').length;
  const removes = lines.filter((l) => l.type === 'remove').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Original (A)</label>
          <textarea value={textA} onChange={(e) => { setTextA(e.target.value); setShow(false); }}
            rows={10} className="tool-textarea" placeholder="Original text..." />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Modified (B)</label>
          <textarea value={textB} onChange={(e) => { setTextB(e.target.value); setShow(false); }}
            rows={10} className="tool-textarea" placeholder="Modified text..." />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => setShow(true)} className="btn-primary">Compare</button>
        {show && (
          <span className="text-xs text-slate-500">
            <span className="text-green-400">+{adds}</span> added, <span className="text-red-400">-{removes}</span> removed
          </span>
        )}
      </div>

      {show && lines.length > 0 && (
        <div className="bg-[#0f1117] border border-[#2a2d3a] rounded-xl overflow-auto font-mono text-sm">
          {lines.map((l, i) => (
            <div key={i} className={`flex gap-3 px-4 py-0.5 ${l.type === 'add' ? 'bg-green-900/20 text-green-300' : l.type === 'remove' ? 'bg-red-900/20 text-red-300' : 'text-slate-400'}`}>
              <span className="w-8 shrink-0 text-right text-slate-600 select-none">{l.lineA ?? ''}</span>
              <span className="w-8 shrink-0 text-right text-slate-600 select-none">{l.lineB ?? ''}</span>
              <span className="w-4 shrink-0 text-slate-600 select-none">
                {l.type === 'add' ? '+' : l.type === 'remove' ? '-' : ' '}
              </span>
              <span className="whitespace-pre-wrap break-all">{l.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

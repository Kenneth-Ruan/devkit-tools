'use client';
import { useState, useMemo } from 'react';
import { parseCron } from '@/lib/transforms';

const COMMON = [
  { label: 'Every minute',       value: '* * * * *' },
  { label: 'Every 5 minutes',    value: '*/5 * * * *' },
  { label: 'Every 15 minutes',   value: '*/15 * * * *' },
  { label: 'Every hour',         value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at noon',  value: '0 12 * * *' },
  { label: 'Every Monday 9am',   value: '0 9 * * 1' },
  { label: 'Every weekday 8am',  value: '0 8 * * 1-5' },
  { label: 'First of month',     value: '0 0 1 * *' },
  { label: 'Every Sunday midnight', value: '0 0 * * 0' },
];


export default function CronParser() {
  const [input, setInput] = useState('0 9 * * 1-5');

  const result = useMemo(() => parseCron(input), [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Cron Expression</label>
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="* * * * *"
            className="tool-textarea flex-1" style={{ resize: 'none', height: 42 }} />
          <button onClick={() => navigator.clipboard.writeText(input)} className="btn-secondary shrink-0">Copy</button>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Format: <span className="font-mono text-slate-500">minute hour day-of-month month day-of-week</span>
        </p>
      </div>

      {'error' in result
        ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{result.error}</div>
        : (
          <div className="bg-[#1a1d27] border border-indigo-700/30 rounded-xl p-4">
            <p className="text-sm text-indigo-300 font-medium">{result.description}</p>
          </div>
        )
      }

      <div>
        <p className="text-xs text-slate-500 mb-2">Common Expressions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON.map(({ label, value }) => (
            <button key={value} onClick={() => setInput(value)}
              className="flex justify-between items-center px-3 py-2 bg-[#1a1d27] border border-[#2a2d3a] rounded-lg hover:border-indigo-600 text-left transition group">
              <span className="text-sm text-slate-300">{label}</span>
              <span className="text-xs font-mono text-slate-500 group-hover:text-indigo-400">{value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

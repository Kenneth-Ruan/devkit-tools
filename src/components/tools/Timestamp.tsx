'use client';
import { useState, useEffect } from 'react';

function resultsFromEpoch(epoch: string): Record<string, string> | null {
  const n = Number(epoch);
  if (isNaN(n) || epoch.trim() === '') return null;
  const ms = epoch.trim().length <= 10 ? n * 1000 : n;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;
  return {
    'UTC':       d.toUTCString(),
    'ISO 8601':  d.toISOString(),
    'Local':     d.toLocaleString(),
    'Date only': d.toLocaleDateString(),
    'Time only': d.toLocaleTimeString(),
    'Unix (s)':  String(Math.floor(ms / 1000)),
    'Unix (ms)': String(ms),
  };
}

function resultsFromDate(dateStr: string): Record<string, string> | null {
  if (!dateStr.trim()) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return {
    'UTC':       d.toUTCString(),
    'ISO 8601':  d.toISOString(),
    'Local':     d.toLocaleString(),
    'Unix (s)':  String(Math.floor(d.getTime() / 1000)),
    'Unix (ms)': String(d.getTime()),
  };
}

export default function Timestamp() {
  const [epoch, setEpoch] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [lastSource, setLastSource] = useState<'epoch' | 'date' | null>(null);

  const results = lastSource === 'epoch'
    ? resultsFromEpoch(epoch)
    : lastSource === 'date'
      ? resultsFromDate(dateStr)
      : null;

  function now() {
    const n = Math.floor(Date.now() / 1000);
    setEpoch(String(n));
    setDateStr('');
    setLastSource('epoch');
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Epoch → Date</p>
          <input value={epoch} onChange={(e) => { setEpoch(e.target.value); setLastSource('epoch'); }}
            placeholder="1700000000" className="tool-textarea" style={{ resize: 'none', height: 40 }} />
          <button onClick={now} className="btn-secondary">Now</button>
        </div>
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Date string → Epoch</p>
          <input value={dateStr} onChange={(e) => { setDateStr(e.target.value); setLastSource('date'); }}
            placeholder="2024-01-15T10:30:00Z" className="tool-textarea" style={{ resize: 'none', height: 40 }} />
        </div>
      </div>

      {lastSource && !results && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">Invalid input.</div>
      )}

      {results && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          {Object.entries(results).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group">
              <span className="text-xs text-slate-500 w-28 shrink-0">{k}</span>
              <span className="text-sm text-slate-200 font-mono flex-1">{v}</span>
              <button onClick={() => navigator.clipboard.writeText(v)}
                className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition ml-3">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

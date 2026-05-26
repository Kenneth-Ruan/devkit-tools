'use client';
import { useState, useMemo } from 'react';
import { compareJson, type JsonDiffEntry } from '@/lib/transforms';

const SAMPLE_A = JSON.stringify({ name: 'Alice', age: 30, role: 'Engineer', skills: ['js', 'ts'] }, null, 2);
const SAMPLE_B = JSON.stringify({ name: 'Alice', age: 31, city: 'Vancouver', skills: ['js', 'ts', 'rust'] }, null, 2);

const TYPE_STYLES: Record<JsonDiffEntry['type'], string> = {
  added:   'bg-green-900/30 border-l-2 border-green-500 text-green-300',
  removed: 'bg-red-900/30 border-l-2 border-red-500 text-red-300',
  changed: 'bg-yellow-900/30 border-l-2 border-yellow-500 text-yellow-300',
  same:    'text-slate-500',
};

const TYPE_LABEL: Record<JsonDiffEntry['type'], string> = {
  added: '+ added', removed: '- removed', changed: '~ changed', same: '= same',
};

export default function JsonCompare() {
  const [a, setA] = useState(SAMPLE_A);
  const [b, setB] = useState(SAMPLE_B);
  const [showSame, setShowSame] = useState(false);

  const { diff, error, stats } = useMemo(() => {
    if (!a.trim() || !b.trim()) return { diff: [], error: '', stats: null };
    try {
      const entries = compareJson(a, b);
      const stats = {
        added: entries.filter((e) => e.type === 'added').length,
        removed: entries.filter((e) => e.type === 'removed').length,
        changed: entries.filter((e) => e.type === 'changed').length,
        same: entries.filter((e) => e.type === 'same').length,
      };
      return { diff: entries, error: '', stats };
    } catch (e) {
      return { diff: [], error: (e as Error).message, stats: null };
    }
  }, [a, b]);

  const visible = showSame ? diff : diff.filter((e) => e.type !== 'same');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">JSON A (original)</label>
          <textarea value={a} onChange={(e) => setA(e.target.value)}
            rows={12} className="tool-textarea" placeholder='{"key": "value"}' />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">JSON B (modified)</label>
          <textarea value={b} onChange={(e) => setB(e.target.value)}
            rows={12} className="tool-textarea" placeholder='{"key": "value"}' />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      {stats && (
        <>
          <div className="flex gap-3 items-center flex-wrap">
            <span className="text-green-400 text-sm font-mono">+{stats.added} added</span>
            <span className="text-red-400 text-sm font-mono">-{stats.removed} removed</span>
            <span className="text-yellow-400 text-sm font-mono">~{stats.changed} changed</span>
            <span className="text-slate-500 text-sm font-mono">={stats.same} same</span>
            <button onClick={() => setShowSame((v) => !v)} className={`ml-auto ${showSame ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 12 }}>
              {showSame ? 'Hide' : 'Show'} unchanged
            </button>
          </div>

          <div className="bg-[#0f1117] border border-[#2a2d3a] rounded-lg overflow-auto max-h-96">
            {visible.length === 0 ? (
              <p className="text-slate-500 text-sm p-4">No differences found.</p>
            ) : (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2a2d3a] text-slate-400">
                    <th className="text-left px-3 py-2 w-8"></th>
                    <th className="text-left px-3 py-2">Path</th>
                    <th className="text-left px-3 py-2">A</th>
                    <th className="text-left px-3 py-2">B</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((entry) => (
                    <tr key={entry.path} className={`border-b border-[#1a1d27] ${TYPE_STYLES[entry.type]}`}>
                      <td className="px-3 py-1.5 text-[10px] opacity-60 whitespace-nowrap">{TYPE_LABEL[entry.type]}</td>
                      <td className="px-3 py-1.5 text-indigo-300">{entry.path}</td>
                      <td className="px-3 py-1.5 text-slate-300">{entry.valueA !== undefined ? JSON.stringify(entry.valueA) : '—'}</td>
                      <td className="px-3 py-1.5 text-slate-300">{entry.valueB !== undefined ? JSON.stringify(entry.valueB) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

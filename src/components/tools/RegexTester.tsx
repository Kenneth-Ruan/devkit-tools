'use client';
import { useState, useMemo } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!pattern) return { error: '', matches: [] as RegExpMatchArray[], highlighted: input };
    try {
      const re = new RegExp(pattern, flags);
      const matches: RegExpMatchArray[] = [];
      let m: RegExpMatchArray | null;
      const iterRe = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      while ((m = iterRe.exec(input)) !== null) {
        matches.push(m);
        if (!flags.includes('g')) break;
      }
      const highlighted = input.replace(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'),
        (s) => `<mark class="bg-yellow-400/30 text-yellow-300 rounded px-0.5">${s}</mark>`);
      return { error: '', matches, highlighted };
    } catch (e) {
      return { error: (e as Error).message, matches: [], highlighted: input };
    }
  }, [pattern, flags, input]);

  const toggleFlag = (f: string) =>
    setFlags((prev) => prev.includes(f) ? prev.replace(f, '') : prev + f);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-slate-500">Flags:</span>
        {['g', 'i', 'm', 's'].map((f) => (
          <button key={f} onClick={() => toggleFlag(f)}
            className={`px-3 py-1 rounded text-sm font-mono ${flags.includes(f) ? 'btn-primary' : 'btn-secondary'}`}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">
          {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">Pattern</label>
        <div className="flex items-center bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-3">
          <span className="text-slate-500 font-mono mr-1">/</span>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)}
            placeholder="(\d+)" className="flex-1 bg-transparent py-2.5 text-sm font-mono text-slate-200 outline-none" />
          <span className="text-slate-500 font-mono ml-1">/{flags}</span>
        </div>
        {result.error && <p className="text-red-400 text-xs mt-1">{result.error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Test String</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12}
            className="tool-textarea" placeholder="Paste text to test against..." />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Highlighted Matches</label>
          <div className="bg-[#0f1117] border border-[#2a2d3a] rounded-lg p-3 text-sm font-mono whitespace-pre-wrap break-all min-h-[12rem] text-slate-300"
            dangerouslySetInnerHTML={{ __html: result.highlighted.replace(/\n/g, '<br/>') }} />
        </div>
      </div>

      {result.matches.length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-[#2a2d3a] text-xs text-slate-500">Match Details</div>
          {result.matches.map((m, i) => (
            <div key={i} className="flex gap-4 px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40">
              <span className="text-xs text-slate-500 w-20 shrink-0">#{i + 1} @ {m.index}</span>
              <span className="text-sm font-mono text-yellow-300 flex-1 break-all">{m[0]}</span>
              {m.length > 1 && (
                <span className="text-xs text-slate-500">groups: {m.slice(1).join(', ')}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

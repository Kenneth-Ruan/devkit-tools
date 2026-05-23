'use client';
import { useState, useMemo } from 'react';
import { convertNumberBase } from '@/lib/transforms';

const BASES: { label: string; base: number; prefix: string; pattern: RegExp }[] = [
  { label: 'Decimal (Base 10)',  base: 10, prefix: '',   pattern: /^-?\d+$/ },
  { label: 'Hexadecimal (Base 16)', base: 16, prefix: '0x', pattern: /^[0-9a-fA-F]+$/ },
  { label: 'Binary (Base 2)',    base: 2,  prefix: '0b', pattern: /^[01]+$/ },
  { label: 'Octal (Base 8)',     base: 8,  prefix: '0o', pattern: /^[0-7]+$/ },
];

export default function NumberBase() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);

  const result = useMemo(() => convertNumberBase(input, fromBase), [input, fromBase]);

  const rows = result ? [
    ['Decimal', result.decimal],
    ['Hexadecimal', result.hex],
    ['Hex (prefixed)', result.hexPrefixed],
    ['Binary', result.binary],
    ['Binary (prefixed)', result.binaryPrefixed],
    ['Octal', result.octal],
    ['Octal (prefixed)', result.octalPrefixed],
  ] : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input Number</label>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="255"
            className="tool-textarea" style={{ resize: 'none', height: 42 }} />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-slate-500">Input base:</span>
          {BASES.map((b) => (
            <button key={b.base} onClick={() => setFromBase(b.base)}
              className={`px-3 py-1 rounded text-sm ${fromBase === b.base ? 'btn-primary' : 'btn-secondary'}`}>
              {b.base === 10 ? 'Dec' : b.base === 16 ? 'Hex' : b.base === 2 ? 'Bin' : 'Oct'}
            </button>
          ))}
        </div>
      </div>

      {input && !result && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
          Invalid input for base {fromBase}.
        </div>
      )}

      {rows.length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group">
              <span className="text-xs text-slate-500 w-36 shrink-0">{k}</span>
              <span className="text-sm text-slate-200 font-mono flex-1 break-all">{v}</span>
              <button onClick={() => navigator.clipboard.writeText(v)}
                className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition ml-3">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

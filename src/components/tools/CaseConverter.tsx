'use client';
import { useState, useMemo } from 'react';
import { toCamel, toPascal, toSnake, toKebab, toScream, toTitle, toSentence, toDot, toFlat } from '@/lib/transforms';

const toConstant = toScream;

const CASES = [
  { key: 'camel',    label: 'camelCase',         fn: toCamel },
  { key: 'pascal',   label: 'PascalCase',         fn: toPascal },
  { key: 'snake',    label: 'snake_case',          fn: toSnake },
  { key: 'kebab',    label: 'kebab-case',          fn: toKebab },
  { key: 'scream',   label: 'SCREAMING_SNAKE',     fn: toScream },
  { key: 'title',    label: 'Title Case',          fn: toTitle },
  { key: 'sentence', label: 'Sentence case',       fn: toSentence },
  { key: 'dot',      label: 'dot.notation',        fn: toDot },
  { key: 'constant', label: 'CONSTANT_CASE',       fn: toConstant },
  { key: 'flat',     label: 'flatcase',            fn: toFlat },
];

export default function CaseConverter() {
  const [input, setInput] = useState('');

  const results = useMemo(() =>
    CASES.map(({ key, label, fn }) => ({ key, label, value: input ? fn(input) : '' })),
    [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Input Text</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3}
          className="tool-textarea" placeholder="hello world example text" />
      </div>
      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
        {results.map(({ key, label, value }) => (
          <div key={key} className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group">
            <span className="text-xs text-slate-500 w-36 shrink-0">{label}</span>
            <span className="text-sm text-slate-200 font-mono flex-1 truncate">{value || <span className="text-slate-600 italic">—</span>}</span>
            {value && (
              <button onClick={() => navigator.clipboard.writeText(value)}
                className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition ml-3">
                Copy
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function sentence(wordCount: number) {
  const ws = Array.from({ length: wordCount }, (_, i) => WORDS[(i * 7 + Math.floor(Math.random() * 3)) % WORDS.length]);
  return capitalize(ws.join(' ')) + '.';
}

function generate(type: string, count: number): string {
  if (type === 'words') {
    return Array.from({ length: count }, (_, i) => WORDS[i % WORDS.length]).join(' ');
  }
  if (type === 'sentences') {
    return Array.from({ length: count }, () => sentence(8 + Math.floor(Math.random() * 8))).join(' ');
  }
  // paragraphs
  return Array.from({ length: count }, () =>
    Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () =>
      sentence(8 + Math.floor(Math.random() * 10))
    ).join(' ')
  ).join('\n\n');
}

export default function LoremIpsum() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0);

  const text = useMemo(() => {
    void seed; // depend on seed for regeneration
    return generate(type, count);
  }, [type, count, seed]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        {(['words', 'sentences', 'paragraphs'] as const).map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={type === t ? 'btn-primary' : 'btn-secondary'}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-2">
          <label className="text-xs text-slate-500">Count:</label>
          <input type="number" min={1} max={50} value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-16 bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-2 py-1.5 text-sm text-slate-200 text-center" />
        </div>
        <button onClick={() => setSeed((s) => s + 1)} className="btn-secondary">Regenerate</button>
        <button onClick={() => navigator.clipboard.writeText(text)} className="btn-secondary ml-auto">Copy</button>
      </div>
      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

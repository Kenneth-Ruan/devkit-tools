'use client';
import { useState, useMemo } from 'react';
import { countStats } from '@/lib/transforms';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => countStats(text), [text]);

  const topWords = useMemo(() => {
    if (!text.trim()) return [];
    const freq: Record<string, number> = {};
    text.toLowerCase().match(/\b[a-z]{3,}\b/g)?.forEach((w) => { freq[w] = (freq[w] ?? 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10}
          className="tool-textarea" placeholder="Paste or type your text here..." />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpace },
          { label: 'Lines', value: stats.lines },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Reading Time', value: `${stats.readingMinutes} min` },
          { label: '~Tokens', value: Math.ceil(stats.chars / 4) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-indigo-400">{value.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {topWords.length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-[#2a2d3a] text-xs text-slate-500">Top Words (3+ chars)</div>
          <div className="flex flex-wrap gap-2 p-4">
            {topWords.map(([word, count]) => (
              <span key={word} className="bg-indigo-600/20 border border-indigo-700/30 rounded-full px-3 py-1 text-sm text-indigo-300">
                {word} <span className="text-indigo-500">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

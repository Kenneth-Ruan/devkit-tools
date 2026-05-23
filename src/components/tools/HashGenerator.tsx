'use client';
import { useState } from 'react';
import { md5 } from '@/lib/transforms';

async function sha(algo: string, text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});

  async function generate() {
    if (!input) return;
    const [sha1, sha256, sha512] = await Promise.all([
      sha('SHA-1', input), sha('SHA-256', input), sha('SHA-512', input),
    ]);
    setResults({ MD5: md5(input), 'SHA-1': sha1, 'SHA-256': sha256, 'SHA-512': sha512 });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Input Text</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4}
          className="tool-textarea" placeholder="Enter text to hash..." />
      </div>
      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary">Generate Hashes</button>
      </div>
      {Object.keys(results).length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          {Object.entries(results).map(([k, v]) => (
            <div key={k} className="px-4 py-3 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">{k}</span>
                <button onClick={() => navigator.clipboard.writeText(v)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition">
                  Copy
                </button>
              </div>
              <span className="text-xs font-mono text-slate-300 break-all">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

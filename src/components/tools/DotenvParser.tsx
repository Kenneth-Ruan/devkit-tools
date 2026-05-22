'use client';
import { useState, useMemo } from 'react';

interface EnvVar { key: string; value: string; comment?: string }

function parseEnv(raw: string): EnvVar[] {
  return raw.split('\n').flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return [];
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) return [];
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Remove inline comments only if outside quotes
    const commentIdx = value.search(/\s+#/);
    let comment: string | undefined;
    if (!value.startsWith('"') && !value.startsWith("'") && commentIdx > 0) {
      comment = value.slice(commentIdx + 1).replace(/^#\s*/, '');
      value = value.slice(0, commentIdx).trim();
    }
    value = value.replace(/^(['"])(.*)\1$/, '$2');
    return [{ key, value, comment }];
  });
}

export default function DotenvParser() {
  const [input, setInput] = useState('');
  const [showValues, setShowValues] = useState(true);

  const vars = useMemo(() => parseEnv(input), [input]);

  const SAMPLE = `# App config
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:password@localhost/mydb"
API_KEY=sk-1234567890abcdef # third-party API
DEBUG=false`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setInput(SAMPLE)} className="btn-secondary">Load Sample</button>
        <button onClick={() => setInput('')} className="btn-secondary">Clear</button>
        <button onClick={() => setShowValues((v) => !v)}
          className={showValues ? 'btn-secondary ml-auto' : 'btn-primary ml-auto'}>
          {showValues ? 'Hide Values' : 'Show Values'}
        </button>
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">.env File Content</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8}
          className="tool-textarea" placeholder={"NODE_ENV=production\nDATABASE_URL=postgresql://...\nAPI_KEY=secret"} />
      </div>

      {vars.length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-[#2a2d3a] flex justify-between text-xs text-slate-500">
            <span>{vars.length} variable{vars.length !== 1 ? 's' : ''} found</span>
          </div>
          {vars.map(({ key, value, comment }) => (
            <div key={key} className="flex items-start justify-between px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group gap-4">
              <span className="text-sm font-mono text-indigo-300 w-48 shrink-0 break-all">{key}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-mono text-slate-200 break-all">
                  {showValues ? value : '•'.repeat(Math.min(value.length, 12))}
                </span>
                {comment && <span className="ml-2 text-xs text-slate-600">#{comment}</span>}
              </div>
              <button onClick={() => navigator.clipboard.writeText(value)}
                className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition shrink-0">
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

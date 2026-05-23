'use client';
import { useState, useMemo } from 'react';
import { formatSql } from '@/lib/transforms';
import SplitPane from '@/components/SplitPane';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);

  const output = useMemo(() => (input.trim() ? formatSql(input, indent) : ''), [input, indent]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Indent:</label>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)}
              className={`px-3 py-1 rounded text-sm ${indent === n ? 'btn-primary' : 'btn-secondary'}`}>{n}</button>
          ))}
        </div>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Input SQL</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
              placeholder="SELECT * FROM users WHERE id = 1 AND active = true ORDER BY created_at DESC;"
              className="tool-textarea" />
          </div>
        }
        right={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Output</label>
            <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
          </div>
        }
      />
    </div>
  );
}

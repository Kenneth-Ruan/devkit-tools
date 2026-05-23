'use client';
import { useState } from 'react';
import { formatSql } from '@/lib/transforms';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);

  function format() {
    setOutput(formatSql(input, indent));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={format} className="btn-primary">Format SQL</button>
        <div className="flex items-center gap-2 ml-2">
          <label className="text-xs text-slate-500">Indent:</label>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)}
              className={`px-3 py-1 rounded text-sm ${indent === n ? 'btn-primary' : 'btn-secondary'}`}>{n}</button>
          ))}
        </div>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input SQL</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
            placeholder={'SELECT * FROM users WHERE id = 1 AND active = true ORDER BY created_at DESC;'}
            className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
        </div>
      </div>
    </div>
  );
}

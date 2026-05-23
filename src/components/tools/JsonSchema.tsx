'use client';
import { useState, useMemo } from 'react';
import { inferType } from '@/lib/transforms';

export default function JsonSchema() {
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const parsed = JSON.parse(input);
      const schema = { $schema: 'http://json-schema.org/draft-07/schema#', ...inferType(parsed) };
      return { output: JSON.stringify(schema, null, 2), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">JSON Example</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
            placeholder={'{\n  "id": 1,\n  "name": "Alice",\n  "active": true,\n  "tags": ["admin"]\n}'}
            className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">JSON Schema</label>
          {error
            ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

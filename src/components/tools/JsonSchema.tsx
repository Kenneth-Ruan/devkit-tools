'use client';
import { useState } from 'react';

function inferType(val: unknown): object {
  if (val === null) return { type: 'null' };
  if (typeof val === 'boolean') return { type: 'boolean' };
  if (typeof val === 'number') return Number.isInteger(val) ? { type: 'integer' } : { type: 'number' };
  if (typeof val === 'string') return { type: 'string' };
  if (Array.isArray(val)) {
    if (val.length === 0) return { type: 'array', items: {} };
    return { type: 'array', items: inferType(val[0]) };
  }
  if (typeof val === 'object') {
    const props: Record<string, object> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      props[k] = inferType(v);
    }
    return {
      type: 'object',
      properties: props,
      required: Object.keys(val as object),
    };
  }
  return {};
}

export default function JsonSchema() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function generate() {
    try {
      const parsed = JSON.parse(input);
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...inferType(parsed),
      };
      setOutput(JSON.stringify(schema, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary">Generate Schema</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
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
          {error ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

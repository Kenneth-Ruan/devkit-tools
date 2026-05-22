'use client';
import { useState } from 'react';
import yaml from 'js-yaml';

export default function YamlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function format() {
    try {
      const parsed = yaml.load(input);
      setOutput(yaml.dump(parsed, { indent: 2 }));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }

  function toJson() {
    try {
      const parsed = yaml.load(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={format} className="btn-primary">Format YAML</button>
        <button onClick={toJson} className="btn-secondary">→ JSON</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input YAML</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18} placeholder={'name: John\nage: 30\nroles:\n  - admin\n  - user'} className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          {error ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

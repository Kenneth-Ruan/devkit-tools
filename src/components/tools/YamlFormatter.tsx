'use client';
import { useState, useMemo } from 'react';
import yaml from 'js-yaml';

export default function YamlFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format' | 'json'>('format');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const parsed = yaml.load(input);
      const result = mode === 'format' ? yaml.dump(parsed, { indent: 2 }) : JSON.stringify(parsed, null, 2);
      return { output: result, error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode('format')} className={mode === 'format' ? 'btn-primary' : 'btn-secondary'}>Format YAML</button>
        <button onClick={() => setMode('json')} className={mode === 'json' ? 'btn-primary' : 'btn-secondary'}>→ JSON</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input YAML</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
            placeholder={'name: John\nage: 30\nroles:\n  - admin\n  - user'} className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          {error
            ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            : <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />}
        </div>
      </div>
    </div>
  );
}

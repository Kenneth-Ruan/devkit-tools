'use client';
import { useState, useMemo } from 'react';
import { parseYaml, dumpYaml } from '@/lib/transforms';
import SplitPane from '@/components/SplitPane';

type Mode = 'json-to-yaml' | 'yaml-to-json';

export default function JsonToYaml() {
  const [mode, setMode] = useState<Mode>('json-to-yaml');
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      if (mode === 'json-to-yaml') {
        return { output: dumpYaml(JSON.parse(input)), error: '' };
      } else {
        return { output: JSON.stringify(parseYaml(input), null, 2), error: '' };
      }
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={() => setMode('json-to-yaml')} className={mode === 'json-to-yaml' ? 'btn-primary' : 'btn-secondary'}>JSON → YAML</button>
        <button onClick={() => setMode('yaml-to-json')} className={mode === 'yaml-to-json' ? 'btn-primary' : 'btn-secondary'}>YAML → JSON</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{mode === 'json-to-yaml' ? 'JSON' : 'YAML'} Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
              placeholder={mode === 'json-to-yaml' ? '{"name": "John", "age": 30}' : 'name: John\nage: 30'}
              className="tool-textarea" />
          </div>
        }
        right={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{mode === 'json-to-yaml' ? 'YAML' : 'JSON'} Output</label>
            {error
              ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
              : <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />}
          </div>
        }
      />
    </div>
  );
}

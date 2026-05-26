'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';
import { formatCss, minifyCss } from '@/lib/transforms';

const SAMPLE = `.container{max-width:1200px;margin:0 auto;padding:0 20px}.header{background:#6366f1;color:white;padding:20px 0}.header h1{font-size:2rem;font-weight:bold;margin:0}.nav a{color:white;text-decoration:none;padding:8px 16px;border-radius:4px;transition:background 0.2s}.nav a:hover{background:rgba(255,255,255,0.1)}@media(max-width:768px){.container{padding:0 12px}.header h1{font-size:1.5rem}}`;

export default function CssFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const out = mode === 'format' ? formatCss(input) : minifyCss(input);
      return { output: out, error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <button onClick={() => setMode('format')} className={mode === 'format' ? 'btn-primary' : 'btn-secondary'}>Format</button>
        <button onClick={() => setMode('minify')} className={mode === 'minify' ? 'btn-primary' : 'btn-secondary'}>Minify</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">CSS Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} placeholder=".class { property: value; }" />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1 block">Output</label>
            {error ? (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            ) : (
              <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
            )}
          </div>
        }
      />
    </div>
  );
}

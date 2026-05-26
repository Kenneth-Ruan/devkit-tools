'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';
import { formatXml, minifyXml } from '@/lib/transforms';

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<catalog><book id="1"><title>Clean Code</title><author>Robert Martin</author><year>2008</year></book><book id="2"><title>The Pragmatic Programmer</title><author>Dave Thomas</author><year>1999</year></book></catalog>`;

function validateXml(xml: string): string | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const err = doc.querySelector('parsererror');
    return err ? err.textContent?.trim() ?? 'Invalid XML' : null;
  } catch {
    return 'Could not validate XML';
  }
}

export default function XmlFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format');

  const { output, error, validMsg } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '', validMsg: '' };
    if (mode === 'validate') {
      const err = validateXml(input);
      return { output: '', error: '', validMsg: err ? `❌ ${err}` : '✓ Valid XML' };
    }
    try {
      const out = mode === 'format' ? formatXml(input) : minifyXml(input);
      return { output: out, error: '', validMsg: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message, validMsg: '' };
    }
  }, [input, mode]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => setMode('format')} className={mode === 'format' ? 'btn-primary' : 'btn-secondary'}>Format</button>
        <button onClick={() => setMode('minify')} className={mode === 'minify' ? 'btn-primary' : 'btn-secondary'}>Minify</button>
        <button onClick={() => setMode('validate')} className={mode === 'validate' ? 'btn-primary' : 'btn-secondary'}>Validate</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      {mode === 'validate' ? (
        <div>
          <label className="text-xs text-slate-500 mb-1 block">XML Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18} className="tool-textarea" />
          {validMsg && (
            <div className={`mt-2 px-4 py-3 rounded-lg text-sm font-mono ${validMsg.startsWith('✓') ? 'bg-green-900/20 border border-green-700 text-green-400' : 'bg-red-900/20 border border-red-700 text-red-400'}`}>
              {validMsg}
            </div>
          )}
        </div>
      ) : (
        <SplitPane
          left={
            <div>
              <label className="text-xs text-slate-500 mb-1 block">XML Input</label>
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} />
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
      )}
    </div>
  );
}

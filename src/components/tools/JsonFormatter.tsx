'use client';
import { useState, useMemo, useEffect, useRef } from 'react';

function stripJsonc(text: string): string {
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '"') {
      const start = i++;
      while (i < text.length) {
        if (text[i] === '\\') { i += 2; continue; }
        if (text[i] === '"') { i++; break; }
        i++;
      }
      result += text.slice(start, i);
    } else if (text[i] === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (text[i] === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i += 2;
    } else {
      result += text[i++];
    }
  }
  return result;
}

function getErrorLoc(input: string, err: Error): { line: number; col: number } | null {
  const m = err.message.match(/at position (\d+)/);
  if (!m) return null;
  const pos = parseInt(m[1]);
  const before = input.slice(0, pos);
  const lines = before.split('\n');
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState('2');
  const [showLines, setShowLines] = useState(false);
  const [jsonc, setJsonc] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { output, error, errorLoc } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '', errorLoc: null };
    try {
      const src = jsonc ? stripJsonc(input) : input;
      const parsed = JSON.parse(src);
      const indentVal = indent === 'tab' ? '\t' : parseInt(indent);
      return {
        output: mode === 'format' ? JSON.stringify(parsed, null, indentVal) : JSON.stringify(parsed),
        error: '',
        errorLoc: null,
      };
    } catch (e) {
      const err = e as Error;
      return { output: '', error: err.message, errorLoc: getErrorLoc(input, err) };
    }
  }, [input, mode, indent, jsonc]);

  useEffect(() => {
    if (!errorLoc || !inputRef.current) return;
    const el = inputRef.current;
    const lines = input.split('\n');
    const lineHeight = el.scrollHeight / Math.max(lines.length, 1);
    el.scrollTop = lineHeight * Math.max(0, errorLoc.line - 4);
  }, [errorLoc, input]);

  const outputLines = output.split('\n');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => setMode('format')} className={mode === 'format' ? 'btn-primary' : 'btn-secondary'}>Format</button>
        <button onClick={() => setMode('minify')} className={mode === 'minify' ? 'btn-primary' : 'btn-secondary'}>Minify</button>
        {mode === 'format' && (
          <label className="text-sm text-slate-400 flex items-center gap-2">
            Indent:
            <select value={indent} onChange={(e) => setIndent(e.target.value)}
              className="bg-[#1a1d27] border border-[#2a2d3a] rounded px-2 py-1 text-sm text-white">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="1">1 space</option>
              <option value="8">8 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </label>
        )}
        <button onClick={() => setShowLines((v) => !v)}
          className={showLines ? 'btn-primary' : 'btn-secondary'}
          title="Toggle line numbers on output">
          # Lines
        </button>
        <button onClick={() => setJsonc((v) => !v)}
          className={jsonc ? 'btn-primary' : 'btn-secondary'}
          title="Allow // and /* */ comments (JSONC format used in tsconfig, .eslintrc, etc.)">
          JSONC
        </button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">
            Input JSON{jsonc && <span className="ml-2 text-indigo-400">JSONC</span>}
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={18}
            placeholder='{"key": "value"}'
            className={`tool-textarea ${error ? 'border-red-700 focus:border-red-600' : ''}`}
          />
          {errorLoc && (
            <p className="mt-1 text-xs text-red-400 font-mono">↑ Line {errorLoc.line}, Col {errorLoc.col}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          {error ? (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm space-y-1">
              <p>{error}</p>
              {errorLoc && <p className="font-mono text-xs text-red-500">Line {errorLoc.line}, Col {errorLoc.col}</p>}
            </div>
          ) : showLines ? (
            <div className="bg-[#0f1117] border border-[#2a2d3a] rounded-lg overflow-auto font-mono text-sm text-slate-200" style={{ minHeight: '18rem', maxHeight: '60vh' }}>
              {outputLines.map((line, i) => (
                <div key={i} className="flex hover:bg-white/[0.03] leading-5">
                  <span className="px-2 text-right text-slate-600 select-none shrink-0 border-r border-[#2a2d3a]" style={{ minWidth: '3rem' }}>
                    {i + 1}
                  </span>
                  <span className="px-3 whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          ) : (
            <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
          )}
        </div>
      </div>
    </div>
  );
}

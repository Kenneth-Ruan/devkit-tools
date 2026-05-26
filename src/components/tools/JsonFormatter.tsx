'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import SplitPane from '@/components/SplitPane';
import JsonTree from '@/components/JsonTree';

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

const LINE_H = '1.375rem'; // 22px — matches textarea line-height

function LineGutter({ lines, errorLine, scrollRef }: { lines: string[]; errorLine?: number; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={scrollRef}
      className="overflow-hidden shrink-0 select-none bg-[#0a0c12] border-r border-[#2a2d3a] py-3 text-right font-mono text-sm text-slate-600"
      style={{ minWidth: '2.75rem' }}
    >
      {lines.map((_, i) => (
        <div key={i} className={`px-2 ${errorLine === i + 1 ? 'text-red-400 font-bold' : ''}`} style={{ lineHeight: LINE_H }}>
          {i + 1}
        </div>
      ))}
    </div>
  );
}

function repairJson(s: string): string {
  let r = s.trim();
  // Remove trailing commas before ] or }
  r = r.replace(/,\s*([}\]])/g, '$1');
  // Replace single quotes with double quotes (naïve but handles simple cases)
  r = r.replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":');
  // Quote unquoted keys
  r = r.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  return r;
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify' | 'tree'>('format');
  const [indent, setIndent] = useState('2');
  const [showLines, setShowLines] = useState(false);
  const [jsonc, setJsonc] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputGutterRef = useRef<HTMLDivElement>(null);
  const outputGutterRef = useRef<HTMLDivElement>(null);
  const outputScrollRef = useRef<HTMLDivElement>(null);

  const { output, error, errorLoc } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '', errorLoc: null };
    if (mode === 'tree') return { output: input, error: '', errorLoc: null };
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

  // Scroll input to error line
  useEffect(() => {
    if (!errorLoc || !inputRef.current) return;
    const el = inputRef.current;
    const lines = input.split('\n');
    const lineH = el.scrollHeight / Math.max(lines.length, 1);
    el.scrollTop = lineH * Math.max(0, errorLoc.line - 4);
  }, [errorLoc, input]);

  function syncInputGutter(e: React.UIEvent<HTMLTextAreaElement>) {
    if (inputGutterRef.current) inputGutterRef.current.scrollTop = e.currentTarget.scrollTop;
  }

  function syncOutputGutter(e: React.UIEvent<HTMLDivElement>) {
    if (outputGutterRef.current) outputGutterRef.current.scrollTop = e.currentTarget.scrollTop;
  }

  const inputLines = input ? input.split('\n') : [''];
  const outputLines = output ? output.split('\n') : [];

  const inputPanel = (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">
        Input JSON{jsonc && <span className="ml-2 text-indigo-400">JSONC</span>}
      </label>
      {showLines ? (
        <div className={`flex rounded-lg overflow-hidden border ${error ? 'border-red-700' : 'border-[#2a2d3a] focus-within:border-indigo-500'} bg-[#0f1117]`}>
          <LineGutter lines={inputLines} errorLine={errorLoc?.line} scrollRef={inputGutterRef} />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onScroll={syncInputGutter}
            rows={18}
            placeholder='{"key": "value"}'
            className="flex-1 bg-transparent outline-none p-3 text-sm font-mono text-slate-200 resize-y"
            style={{ lineHeight: LINE_H }}
          />
        </div>
      ) : (
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={18}
          placeholder='{"key": "value"}'
          className={`tool-textarea ${error ? 'border-red-700 focus:border-red-600' : ''}`}
        />
      )}
      {errorLoc && <p className="mt-1 text-xs text-red-400 font-mono">↑ Line {errorLoc.line}, Col {errorLoc.col}</p>}
    </div>
  );

  const outputPanel = (
    <div className="flex flex-col h-full">
      <label className="text-xs text-slate-500 mb-1 block">Output</label>
      {mode === 'tree' ? (
        <JsonTree json={input} />
      ) : error ? (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm space-y-1">
          <p>{error}</p>
          {errorLoc && <p className="font-mono text-xs text-red-500">Line {errorLoc.line}, Col {errorLoc.col}</p>}
          <button onClick={() => setInput(repairJson(input))}
            className="text-xs text-yellow-400 hover:text-yellow-300 underline mt-1">
            Try auto-repair
          </button>
        </div>
      ) : showLines ? (
        <div className="flex rounded-lg overflow-hidden border border-[#2a2d3a] bg-[#0f1117]" style={{ minHeight: '18rem' }}>
          <LineGutter lines={outputLines} scrollRef={outputGutterRef} />
          <div
            className="flex-1 overflow-auto p-3 text-sm font-mono text-slate-200"
            style={{ lineHeight: LINE_H }}
            onScroll={syncOutputGutter}
            ref={outputScrollRef}
          >
            {outputLines.map((line, i) => (
              <div key={i} className="whitespace-pre hover:bg-white/[0.03]" style={{ lineHeight: LINE_H }}>{line}</div>
            ))}
          </div>
        </div>
      ) : (
        <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => setMode('format')} className={mode === 'format' ? 'btn-primary' : 'btn-secondary'}>Format</button>
        <button onClick={() => setMode('minify')} className={mode === 'minify' ? 'btn-primary' : 'btn-secondary'}>Minify</button>
        <button onClick={() => setMode('tree')} className={mode === 'tree' ? 'btn-primary' : 'btn-secondary'}>Tree</button>
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
        <button onClick={() => setShowLines((v) => !v)} className={showLines ? 'btn-primary' : 'btn-secondary'} title="Toggle line numbers">
          # Lines
        </button>
        <button onClick={() => setJsonc((v) => !v)} className={jsonc ? 'btn-primary' : 'btn-secondary'} title="Allow // and /* */ comments">
          JSONC
        </button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <SplitPane left={inputPanel} right={outputPanel} />
    </div>
  );
}

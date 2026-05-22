'use client';
import { useState, useEffect, useRef, useId } from 'react';

const SAMPLE = `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug it]
    D --> A`;

export default function MermaidPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [error, setError] = useState('');
  const divRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
        const { svg } = await mermaid.render(`mermaid-${id}`, input);
        if (!cancelled && divRef.current) {
          divRef.current.innerHTML = svg;
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    }
    if (input.trim()) render();
  }, [input, id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: 'calc(100vh - 200px)' }}>
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Mermaid Diagram</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="tool-textarea flex-1" style={{ resize: 'none' }} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Preview</label>
        <div className="flex-1 bg-[#1a1d27] border border-[#2a2d3a] rounded-lg p-4 overflow-auto flex items-start justify-center">
          {error
            ? <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm w-full">{error}</div>
            : <div ref={divRef} className="w-full" />}
        </div>
      </div>
    </div>
  );
}

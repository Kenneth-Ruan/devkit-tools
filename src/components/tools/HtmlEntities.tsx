'use client';
import { useState, useMemo } from 'react';
import { encodeEntities, decodeEntities } from '@/lib/transforms';
import SplitPane from '@/components/SplitPane';

const REFERENCE = [
  { entity: '&amp;',   char: '&',  desc: 'Ampersand' },
  { entity: '&lt;',    char: '<',  desc: 'Less than' },
  { entity: '&gt;',    char: '>',  desc: 'Greater than' },
  { entity: '&quot;',  char: '"',  desc: 'Double quote' },
  { entity: '&#39;',   char: "'",  desc: 'Single quote' },
  { entity: '&nbsp;',  char: ' ',  desc: 'Non-breaking space' },
  { entity: '&copy;',  char: '©',  desc: 'Copyright' },
  { entity: '&reg;',   char: '®',  desc: 'Registered' },
  { entity: '&trade;', char: '™',  desc: 'Trademark' },
  { entity: '&mdash;', char: '—',  desc: 'Em dash' },
  { entity: '&ndash;', char: '–',  desc: 'En dash' },
  { entity: '&hellip;',char: '…',  desc: 'Ellipsis' },
  { entity: '&laquo;', char: '«',  desc: 'Left guillemet' },
  { entity: '&raquo;', char: '»',  desc: 'Right guillemet' },
];

export default function HtmlEntities() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    if (!input) return '';
    return mode === 'encode' ? encodeEntities(input) : decodeEntities(input);
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode('encode')} className={mode === 'encode' ? 'btn-primary' : 'btn-secondary'}>Encode</button>
        <button onClick={() => setMode('decode')} className={mode === 'decode' ? 'btn-primary' : 'btn-secondary'}>Decode</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>

      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="tool-textarea"
              placeholder={mode === 'encode' ? '<div class="hello">World & More</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'} />
          </div>
        }
        right={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Output</label>
            <textarea readOnly value={output} rows={10} className="tool-textarea opacity-80" />
          </div>
        }
      />

      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-[#2a2d3a] text-xs text-slate-500">Common HTML Entities</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
          {REFERENCE.map(({ entity, char, desc }) => (
            <div key={entity} className="flex items-center gap-2 px-3 py-2.5 border-b border-r border-[#2a2d3a] hover:bg-[#2a2d3a]/40 group cursor-pointer"
              onClick={() => navigator.clipboard.writeText(entity)}>
              <span className="text-lg w-8 text-center">{char}</span>
              <div>
                <div className="text-xs font-mono text-indigo-300">{entity}</div>
                <div className="text-xs text-slate-600">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

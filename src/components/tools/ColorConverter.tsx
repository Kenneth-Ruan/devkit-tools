'use client';
import { useState, useMemo } from 'react';
import { hexToRgb, rgbToHsl, rgbToHsv, parseColorInput as parseInput } from '@/lib/transforms';

export default function ColorConverter() {
  const [input, setInput] = useState('#6366f1');

  const { hex, error, rows } = useMemo(() => {
    const h = parseInput(input);
    if (!h) return { hex: null, error: 'Invalid color. Try #rrggbb, #rgb, or rgb(r,g,b)', rows: [] };
    const { r, g, b } = hexToRgb(h);
    const hsl = rgbToHsl(r, g, b);
    const hsv = rgbToHsv(r, g, b);
    return {
      hex: h,
      error: '',
      rows: [
        ['HEX', h.toUpperCase()],
        ['HEX (lower)', h.toLowerCase()],
        ['RGB', `rgb(${r}, ${g}, ${b})`],
        ['RGBA', `rgba(${r}, ${g}, ${b}, 1)`],
        ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
        ['HSV', `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`],
        ['R', String(r)], ['G', String(g)], ['B', String(b)],
      ] as [string, string][],
    };
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <label className="text-xs text-slate-500 mb-1 block">Color Input</label>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="#6366f1 or rgb(99, 102, 241)"
            className="tool-textarea" style={{ resize: 'none', height: 42 }} />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
        {hex && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Preview</label>
            <div className="w-20 h-[42px] rounded-lg border border-[#2a2d3a]" style={{ background: hex }} />
          </div>
        )}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Pick</label>
          <input type="color" value={hex ?? '#000000'}
            onChange={(e) => setInput(e.target.value)}
            className="h-[42px] w-14 rounded-lg border border-[#2a2d3a] bg-transparent cursor-pointer" />
        </div>
      </div>

      {rows.length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group">
              <span className="text-xs text-slate-500 w-28 shrink-0">{k}</span>
              <span className="text-sm text-slate-200 font-mono flex-1">{v}</span>
              <button onClick={() => navigator.clipboard.writeText(v)}
                className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition ml-3">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function parseInput(raw: string): string | null {
  const s = raw.trim();
  if (/^#?[0-9a-fA-F]{6}$/.test(s)) return s.startsWith('#') ? s : '#' + s;
  if (/^#?[0-9a-fA-F]{3}$/.test(s)) {
    const hex = s.startsWith('#') ? s.slice(1) : s;
    return '#' + hex.split('').map((c) => c + c).join('');
  }
  const rgb = s.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgb) {
    return '#' + [rgb[1], rgb[2], rgb[3]].map((n) => parseInt(n).toString(16).padStart(2, '0')).join('');
  }
  return null;
}

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

'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TOOLS, type Tool } from '@/lib/tools';

export default function ToolSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: Tool[] = query.trim().length > 0
    ? TOOLS.filter((t) => {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }).slice(0, 7)
    : [];

  useEffect(() => { setHighlighted(0); }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function go(slug: string) {
    setQuery('');
    setOpen(false);
    router.push(`/tools/${slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    if (e.key === 'Enter' && results[highlighted]) go(results[highlighted].slug);
    if (e.key === 'Escape') { setOpen(false); setQuery(''); inputRef.current?.blur(); }
  }

  return (
    <div ref={containerRef} className="hidden md:block relative">
      <div className="flex items-center gap-2 bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-3 py-1.5 w-80 focus-within:border-indigo-500 transition">
        <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          placeholder="Search tools…"
          className="bg-transparent outline-none text-xs text-slate-300 placeholder-slate-600 w-full"
        />
        {!query && (
          <kbd className="text-[10px] text-slate-600 font-mono bg-[#1a1d27] px-1 rounded border border-[#2a2d3a]">⌘K</kbd>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full right-0 mt-1.5 w-64 bg-[#1a1d27] border border-[#2a2d3a] rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.map((t, i) => (
            <button
              key={t.slug}
              onMouseDown={() => go(t.slug)}
              onMouseEnter={() => setHighlighted(i)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition ${
                i === highlighted ? 'bg-indigo-600/20' : 'hover:bg-[#2a2d3a]/60'
              }`}
            >
              <span className="text-base shrink-0 w-6 text-center">{t.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm text-white truncate">{t.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

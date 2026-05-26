'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/lib/tools';
import SponsorBanner from '@/components/SponsorBanner';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dev Tooling Online',
  url: 'https://www.devtooling.online',
  description: 'Free online developer tools: JSON formatter, Base64, URL encoder, timestamp converter, regex tester, and 25+ more. No login required.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.devtooling.online/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = TOOLS.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const q = query.toLowerCase();
    const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-3">⚡ Dev Tooling Online</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          30+ developer tools. No login required. Just tools.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools... (json, base64, timestamp...)"
          className="w-full bg-[#1a1d27] border border-[#2a2d3a] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-[#1a1d27] border border-[#2a2d3a] text-slate-400 hover:border-indigo-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-16">No tools match &ldquo;{query}&rdquo;</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-[#1a1d27] border border-[#2a2d3a] hover:border-indigo-500 rounded-xl p-4 transition active:scale-[0.98]"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5 shrink-0 font-mono">{tool.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">{tool.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <SponsorBanner />

      <footer className="mt-2 text-center text-xs text-slate-600">
        Dev Tooling Online — free, lightweight developer utilities. Secure — no backends, no login required.
      </footer>
    </div>
  );
}

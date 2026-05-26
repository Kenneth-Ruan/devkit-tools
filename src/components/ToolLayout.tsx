import Link from 'next/link';
import { TOOLS, FAMILY_LABELS } from '@/lib/tools';
import ToolSearch from '@/components/ToolSearch';
import SponsorBanner from '@/components/SponsorBanner';

export default function ToolLayout({
  name,
  description,
  slug,
  children,
}: {
  name: string;
  description: string;
  slug?: string;
  children: React.ReactNode;
}) {
  const currentTool = slug ? TOOLS.find((t) => t.slug === slug) : null;
  const family = currentTool?.family;
  const familyTools = family ? TOOLS.filter((t) => t.family === family) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[#2a2d3a] px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="text-slate-400 hover:text-white transition text-sm font-semibold shrink-0">
            ⚡ Dev Tooling Online
          </Link>
          <span className="text-[#2a2d3a] shrink-0">/</span>
          <span className="text-white text-sm font-semibold truncate">{name}</span>
        </div>
        <ToolSearch />
        <div />
      </header>

      {familyTools.length > 1 && family && (
        <nav className="border-b border-[#2a2d3a] bg-[#0a0c12] px-4 py-2 flex items-center gap-3 overflow-x-auto">
          <span className="text-xs text-slate-500 shrink-0">{FAMILY_LABELS[family] ?? 'Related'}:</span>
          <div className="flex gap-1.5 flex-wrap">
            {familyTools.map((t) =>
              t.slug === slug ? (
                <span key={t.slug} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 text-white">
                  {t.name}
                </span>
              ) : (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-white hover:bg-[#2a2d3a] transition"
                >
                  {t.name}
                </Link>
              )
            )}
          </div>
        </nav>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">{name}</h1>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        </div>
        {children}
      </main>

      <SponsorBanner />
    </div>
  );
}

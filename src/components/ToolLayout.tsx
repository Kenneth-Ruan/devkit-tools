import Link from 'next/link';

export default function ToolLayout({ name, description, children }: { name: string; description: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[#2a2d3a] px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-slate-400 hover:text-white transition text-sm font-semibold">
          ⚡ DevKit
        </Link>
        <span className="text-[#2a2d3a]">/</span>
        <span className="text-white text-sm font-semibold">{name}</span>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">{name}</h1>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

const BASE = 'https://devkit.tools';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: { default: 'DevKit — Developer Tools Online', template: '%s | DevKit' },
  description: 'Free online developer tools: JSON formatter, Base64, URL encoder, timestamp converter, regex tester, markdown preview, and 25+ more. Fast, no login required.',
  keywords: ['developer tools', 'json formatter', 'base64 encoder', 'url encoder', 'timestamp converter', 'regex tester', 'markdown preview', 'devtools online'],
  alternates: { canonical: BASE },
  openGraph: {
    type: 'website',
    siteName: 'DevKit',
    url: BASE,
    title: 'DevKit — Developer Tools Online',
    description: 'Free online developer tools. JSON, Base64, timestamps, regex, markdown, and 25+ more. No login, no tracking.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'DevKit — Developer Tools Online', description: 'Free online developer tools. 30+ tools. No login.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#0f1117] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}

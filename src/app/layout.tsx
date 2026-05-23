import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

const BASE = 'https://devtooling.online';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: { default: 'Dev Tooling Online', template: '%s | Dev Tooling Online' },
  description: 'Free online developer tools: JSON formatter, Base64, URL encoder, timestamp converter, regex tester, markdown preview, and 25+ more. Fast, no login required.',
  keywords: ['developer tools', 'json formatter', 'base64 encoder', 'url encoder', 'timestamp converter', 'regex tester', 'markdown preview', 'devtools online'],
  alternates: { canonical: BASE },
  openGraph: {
    type: 'website',
    siteName: 'Dev Tooling Online',
    url: BASE,
    title: 'Dev Tooling Online',
    description: 'Free online developer tools. JSON, Base64, timestamps, regex, markdown, and 25+ more. No login required.',
  },
  twitter: { card: 'summary_large_image', title: 'Dev Tooling Online', description: 'Free online developer tools. 30+ tools. No login required.' },
  robots: { index: true, follow: true },
};

const GA_ID = 'G-DXZ5XF6F01';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#0f1117] text-slate-200 antialiased">
        {children}
      </body>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
    </html>
  );
}

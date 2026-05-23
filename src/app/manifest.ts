import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dev Tooling Online',
    short_name: 'DevTools',
    description: 'Free online developer tools. 30+ tools. No login required.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1117',
    theme_color: '#6366f1',
    icons: [
      { src: '/icon-192', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512', sizes: '512x512', type: 'image/png' },
    ],
  };
}

import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';

const BASE = 'https://devtooling.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = TOOLS.map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...toolRoutes,
  ];
}

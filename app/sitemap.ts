import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { siteConfig } from '@/lib/seo';

export const revalidate = 3600; // refresh hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteConfig.url}/kittens`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 }
  ];

  let kittenRoutes: MetadataRoute.Sitemap = [];
  try {
    const kittens = await prisma.kitten.findMany({
      where: { status: { not: 'SOLD' } },
      select: { id: true, updatedAt: true }
    });
    kittenRoutes = kittens.map((k) => ({
      url: `${siteConfig.url}/kittens/${k.id}`,
      lastModified: k.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }));
  } catch {
    // DB unavailable at build time — static routes still ship.
  }

  return [...staticRoutes, ...kittenRoutes];
}

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep private / transactional areas out of the index.
      disallow: ['/admin', '/dashboard', '/account', '/auth', '/api', '/verify-funds', '/frozen', '/thank-you', '/referrals', '/r/']
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url
  };
}

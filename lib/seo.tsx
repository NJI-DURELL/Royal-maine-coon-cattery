import type { Kitten } from '@prisma/client';

// Resolve the canonical site URL. Prefer an explicit env var; otherwise fall back
// to Vercel's production domain so canonicals/sitemap/OG are never "localhost" in
// production even if NEXT_PUBLIC_SITE_URL is forgotten.
const resolveSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:3000';
};

export const siteConfig = {
  name: 'Royal Maine Coon Cattery',
  shortName: 'Royal Maine Coon',
  url: resolveSiteUrl(),
  description:
    'Licensed Maine Coon cattery raising purebred, health-tested kittens. Pedigree documentation, vaccinations, and microchipping included. Apply to adopt and schedule a private video viewing.',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'royal.maine.coon.catt@gmail.com',
  ogImage: '/opengraph-image',
  socials: {
    facebook: 'https://www.facebook.com/profile.php?id=61578433262779',
    tiktok: 'https://tiktok.com/@royal.maine.catt'
  }
} as const;

export const absoluteUrl = (path = '') => `${siteConfig.url}${path}`;

/** Descriptive alt text for a kitten image (better than just the name). */
export const kittenAlt = (kitten: Pick<Kitten, 'name' | 'color' | 'gender' | 'ageWeeks'>) =>
  `${kitten.name}, a ${kitten.color} ${kitten.gender.toLowerCase()} purebred Maine Coon kitten, ${kitten.ageWeeks} weeks old`;

/** Organization / LocalBusiness JSON-LD for site-wide trust signals. */
export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'PetStore'],
  '@id': absoluteUrl('/#organization'),
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.email,
  image: absoluteUrl(siteConfig.ogImage),
  logo: absoluteUrl('/favicon.ico'),
  // Links the brand entity to its official profiles (helps Google's knowledge panel).
  sameAs: Object.values(siteConfig.socials),
  knowsAbout: ['Maine Coon cats', 'Purebred kitten breeding', 'Cat pedigree', 'Feline health testing']
});

/** Product + Offer JSON-LD for an individual kitten listing (rich results). */
export const kittenSchema = (kitten: Kitten) => {
  const availability =
    kitten.status === 'AVAILABLE'
      ? 'https://schema.org/InStock'
      : kitten.status === 'RESERVED'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/SoldOut';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': absoluteUrl(`/kittens/${kitten.id}#product`),
    name: `${kitten.name} — Purebred Maine Coon Kitten`,
    description:
      kitten.description ??
      `${kitten.name} is a ${kitten.color} ${kitten.gender.toLowerCase()} purebred Maine Coon kitten with full pedigree and health records.`,
    image: kitten.mainImageUrl,
    category: 'Maine Coon Kitten',
    color: kitten.color,
    brand: { '@type': 'Brand', name: siteConfig.name },
    offers: {
      '@type': 'Offer',
      price: kitten.price,
      priceCurrency: 'USD',
      availability,
      url: absoluteUrl(`/kittens/${kitten.id}`),
      seller: { '@id': absoluteUrl('/#organization') }
    }
  };
};

export const faqSchema = (items: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer }
  }))
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path)
  }))
});

/** Render a JSON-LD <script> tag. Usage: {jsonLd(organizationSchema())} */
export const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

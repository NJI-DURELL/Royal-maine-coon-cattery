import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig, organizationSchema, JsonLd } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Royal Maine Coon Cattery | Purebred, Health-Tested Kittens',
    template: '%s | Royal Maine Coon Cattery'
  },
  description: siteConfig.description,
  keywords: [
    'Maine Coon kittens',
    'Maine Coon kittens for sale',
    'purebred Maine Coon',
    'Maine Coon breeder',
    'Maine Coon cattery',
    'health-tested Maine Coon kittens'
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Royal Maine Coon Cattery | Purebred, Health-Tested Kittens',
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US'
    // og:image is provided by app/opengraph-image.tsx (file-based metadata)
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Royal Maine Coon Cattery | Purebred, Health-Tested Kittens',
    description: siteConfig.description
    // twitter:image is provided by app/twitter-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
  }
  // Favicon is provided by app/icon.svg (Next.js file-based metadata convention).
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-slate-900 antialiased">
        <JsonLd data={organizationSchema()} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-royal-500 focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <Navbar />
          <main id="main-content" className="flex-1 pt-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

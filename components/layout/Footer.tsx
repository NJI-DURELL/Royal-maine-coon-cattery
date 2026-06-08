import Link from 'next/link';
import { Facebook } from 'lucide-react';
import { siteConfig } from '@/lib/seo';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.93a2.32 2.32 0 1 1-2.32-2.32c.24 0 .47.04.69.1V8.4a5.6 5.6 0 0 0-.69-.04A5.52 5.52 0 1 0 15.54 14V8.66a7.5 7.5 0 0 0 4.36 1.4V6.86a4.28 4.28 0 0 1-3.3-1.04Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 overflow-hidden rounded-[2.5rem] bg-silk p-8 text-cream/80 sm:p-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-400 to-royal-600 font-display text-lg font-semibold text-ink">RM</span>
            <span className="font-display text-xl font-semibold text-white">Royal Maine Coon Cattery</span>
          </Link>
          <p className="text-sm leading-7 text-cream/65">
            Licensed breeder of purebred, health-tested Maine Coon kittens — raised in our home and placed with
            loving families.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-royal-300">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kittens" className="hover:text-royal-300">Available kittens</Link></li>
              <li><Link href="/verify-funds" className="hover:text-royal-300">Apply to adopt</Link></li>
              <li><Link href="/referrals" className="hover:text-royal-300">Refer a friend</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-royal-300">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-royal-300">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-royal-300">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-royal-300">Terms</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-royal-300">Get in touch</p>
            <a href={`mailto:${siteConfig.email}`} className="block text-sm hover:text-royal-300">{siteConfig.email}</a>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Royal Maine Coon Cattery on Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/80 transition hover:border-royal-400 hover:text-royal-300"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Royal Maine Coon Cattery on TikTok"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/80 transition hover:border-royal-400 hover:text-royal-300"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-xs text-cream/50">
        © {new Date().getFullYear()} Royal Maine Coon Cattery. Licensed breeder with health-tested purebred Maine Coon kittens.
      </div>
    </footer>
  );
}

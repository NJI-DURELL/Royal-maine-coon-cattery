import Link from 'next/link';
import { siteConfig } from '@/lib/seo';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Royal Maine Coon Cattery about adopting a purebred Maine Coon kitten.'
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Get in touch</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Contact the cattery</h1>
        <p className="mt-3 text-slate-600">
          Questions about a kitten, the adoption process, or delivery? We&apos;re happy to help.
        </p>
      </div>
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-slate-700">
          Email: <a href={`mailto:${siteConfig.email}`} className="font-semibold text-royal-700 hover:text-royal-800">{siteConfig.email}</a>
        </p>
        <p className="text-slate-700">
          Phone: <a href={siteConfig.phoneHref} className="font-semibold text-royal-700 hover:text-royal-800">{siteConfig.phone}</a>
        </p>
        <p className="text-sm text-slate-600">
          Ready to adopt? The fastest path is to{' '}
          <Link href="/verify-funds" className="font-semibold text-royal-700 hover:text-royal-800">start your application</Link>{' '}
          — we&apos;ll follow up to schedule a private video viewing.
        </p>
      </div>
    </section>
  );
}

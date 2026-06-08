import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { kittenSchema, breadcrumbSchema, kittenAlt, JsonLd } from '@/lib/seo';

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  SOLD: 'danger'
};

const getKitten = (id: string) =>
  prisma.kitten.findUnique({ where: { id } }).catch(() => null);

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const kitten = await getKitten(params.id);
  if (!kitten) return { title: 'Kitten not found' };

  const title = `${kitten.name} — ${kitten.color} ${kitten.gender} Maine Coon Kitten`;
  const description =
    kitten.description ??
    `Meet ${kitten.name}, a ${kitten.color} ${kitten.gender.toLowerCase()} purebred Maine Coon kitten (${kitten.ageWeeks} weeks old). Health-tested, vaccinated, and microchipped. Apply to adopt.`;

  return {
    title,
    description,
    alternates: { canonical: `/kittens/${kitten.id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: kitten.mainImageUrl, alt: kittenAlt(kitten) }]
    }
  };
}

export default async function KittenDetailPage({ params }: { params: { id: string } }) {
  const kitten = await getKitten(params.id);

  if (!kitten) {
    notFound();
  }

  return (
    <section className="space-y-10">
      <JsonLd data={kittenSchema(kitten)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Kittens', path: '/kittens' },
          { name: kitten.name, path: `/kittens/${kitten.id}` }
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:text-royal-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/kittens" className="hover:text-royal-700">Kittens</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{kitten.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-100">
              <Image
                src={kitten.mainImageUrl}
                alt={kittenAlt(kitten)}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-3">
              <Badge variant={statusVariant[kitten.status]}>{kitten.status}</Badge>
              <h1 className="text-4xl font-semibold text-slate-900">{kitten.name}</h1>
              <p className="text-lg text-slate-600">{kitten.gender} • {kitten.color} • {kitten.ageWeeks} weeks old</p>
              <p className="text-3xl font-semibold text-royal-700">${kitten.price.toFixed(0)}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">Pedigree</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{kitten.pedigree ?? 'Multi-generation Maine Coon bloodlines with breeder-provided pedigree documentation.'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">Health tests</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{kitten.healthTests ?? 'Vaccinated, microchipped, and screened for common Maine Coon health markers.'}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Description</h2>
            <p className="mt-3 text-slate-600 leading-7">{kitten.description ?? 'Gentle, social, and raised with full litter support. This kitten is ready for a loving home with responsible adopters.'}</p>
          </div>
        </div>
        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Interested in this kitten?</h2>
            <p className="text-slate-600">Complete the fund verification workflow to schedule a short live video call with the breeder.</p>
          </div>
          <Link href={`/verify-funds?kitten=${kitten.id}`} className="inline-flex w-full items-center justify-center rounded-full bg-royal-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-royal-600">
            I'm interested in this kitten
          </Link>
          <a href="mailto:breeder@royalmainecoon.com" className="text-center text-sm font-semibold text-royal-700 hover:text-royal-800">Contact breeder</a>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">Kitten care</h3>
            <p className="mt-3 text-sm text-slate-600">Includes support for transport planning, diet guidance, and transition to your home.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

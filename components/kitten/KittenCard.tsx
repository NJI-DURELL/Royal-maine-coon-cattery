import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { type Kitten } from '@prisma/client';
import { kittenAlt } from '@/lib/seo';

const statusPill: Record<string, string> = {
  AVAILABLE: 'bg-royal-500 text-ink',
  RESERVED: 'bg-white/85 text-ink',
  SOLD: 'bg-ink/80 text-cream ring-1 ring-white/20'
};

const statusLabel: Record<string, string> = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Adopted'
};

export function KittenCard({ kitten }: { kitten: Kitten }) {
  return (
    <Link
      href={`/kittens/${kitten.id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-ink shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500 focus-visible:ring-offset-2"
    >
      <Image
        src={kitten.mainImageUrl}
        alt={kittenAlt(kitten)}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      {/* Status pill */}
      <span
        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusPill[kitten.status] ?? statusPill.AVAILABLE}`}
      >
        {statusLabel[kitten.status] ?? kitten.status}
      </span>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-2xl font-semibold text-white">{kitten.name}</h3>
        <p className="mt-0.5 text-sm text-cream/80">{kitten.gender} · {kitten.color}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-royal-300">${kitten.price.toFixed(0)}</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-royal-300 transition group-hover:gap-2">
            Learn more <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

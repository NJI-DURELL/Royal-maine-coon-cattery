import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { type Kitten } from '@prisma/client';
import { kittenAlt } from '@/lib/seo';

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  SOLD: 'danger'
};

export function KittenCard({ kitten }: { kitten: Kitten }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-72 overflow-hidden bg-slate-100">
        <Image
          src={kitten.mainImageUrl}
          alt={kittenAlt(kitten)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{kitten.name}</h3>
            <p className="text-sm text-slate-500">{kitten.gender} • {kitten.color}</p>
          </div>
          <Badge variant={statusVariant[kitten.status]}>{kitten.status}</Badge>
        </div>
        <p className="text-sm leading-6 text-slate-600 line-clamp-2">{kitten.description ?? 'Purebred Maine Coon kitten with loving care and full pedigree details.'}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-slate-900">${kitten.price.toFixed(0)}</span>
          <Link href={`/kittens/${kitten.id}`} className="text-sm font-semibold text-royal-700 hover:text-royal-800">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DeleteKittenButton } from '@/components/admin/DeleteKittenButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Manage kittens' };

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  SOLD: 'danger'
};

export default async function AdminKittensPage() {
  const kittens = await prisma.kitten.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Inventory</p>
          <h1 className="text-3xl font-semibold text-slate-900">Manage kittens</h1>
          <p className="mt-2 text-slate-600">{kittens.length} total · {kittens.filter((k) => k.status === 'AVAILABLE').length} available</p>
        </div>
        <Link href="/admin/kittens/new">
          <Button>+ Add new kitten</Button>
        </Link>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        {kittens.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            No kittens yet. <Link href="/admin/kittens/new" className="font-semibold text-royal-700 hover:text-royal-800">Add your first kitten</Link>.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {kittens.map((k) => (
              <li key={k.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={k.mainImageUrl} alt={k.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{k.name}</p>
                    <p className="text-sm text-slate-500">{k.gender} · {k.color} · {k.ageWeeks}w · ${k.price.toFixed(0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[k.status]}>{k.status}</Badge>
                  <Link href={`/kittens/${k.id}`} className="text-xs font-semibold text-royal-700 hover:text-royal-800">View</Link>
                  <DeleteKittenButton id={k.id} name={k.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

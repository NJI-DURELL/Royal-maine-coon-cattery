import Link from 'next/link';
import { prisma } from '@/lib/db';
import { presignProofView } from '@/lib/storage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerificationActions } from '@/components/admin/VerificationActions';

export const dynamic = 'force-dynamic';

type PendingBuyer = {
  id: string;
  kittensInterested: string[];
  proofAmount: number | null;
  proofDescription: string | null;
  proofViewUrl: string | null;
  user: { name: string | null; email: string; phone: string | null };
};

const getAdminData = async () => {
  try {
    const [kittenCounts, buyerCounts, rawPending] = await Promise.all([
      prisma.kitten.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.buyer.groupBy({ by: ['proofStatus'], _count: { proofStatus: true } }),
      prisma.buyer.findMany({
        where: { proofStatus: 'PENDING' },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Sign a short-lived view URL for each uploaded proof document (files are private).
    const pendingBuyers: PendingBuyer[] = await Promise.all(
      rawPending.map(async (b) => ({
        id: b.id,
        kittensInterested: b.kittensInterested,
        proofAmount: b.proofAmount,
        proofDescription: b.proofDescription,
        proofViewUrl: b.proofUrl ? await presignProofView(b.proofUrl) : null,
        user: { name: b.user.name, email: b.user.email, phone: b.user.phone }
      }))
    );

    return { kittenCounts, buyerCounts, pendingBuyers };
  } catch {
    return {
      kittenCounts: [] as Array<{ status: string; _count: { status: number } }>,
      buyerCounts: [] as Array<{ proofStatus: string; _count: { proofStatus: number } }>,
      pendingBuyers: [] as PendingBuyer[]
    };
  }
};

export default async function AdminPage() {
  const { kittenCounts, buyerCounts, pendingBuyers } = await getAdminData();

  const countMap = Object.fromEntries(kittenCounts.map((item) => [item.status, item._count.status]));
  const buyerMap = Object.fromEntries(buyerCounts.map((item) => [item.proofStatus, item._count.proofStatus]));

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Admin dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-900">Royal Maine Coon control center</h1>
            <p className="mt-3 text-slate-600">Review kitten inventory, manage buyer verification, and update breeder settings.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/settings">
              <Button variant="secondary">Platform settings</Button>
            </Link>
            <Link href="#pending">
              <Button variant="secondary">Review verifications</Button>
            </Link>
            <Link href="/admin/kittens">
              <Button>Manage kittens</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Total kittens</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">{Object.values(countMap).reduce((sum, value) => sum + value, 0)}</p>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>Available: {countMap.AVAILABLE ?? 0}</p>
            <p>Reserved: {countMap.RESERVED ?? 0}</p>
            <p>Sold: {countMap.SOLD ?? 0}</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Buyer verifications</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">{Object.values(buyerMap).reduce((sum, value) => sum + value, 0)}</p>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>Pending: {buyerMap.PENDING ?? 0}</p>
            <p>Approved: {buyerMap.APPROVED ?? 0}</p>
            <p>Rejected: {buyerMap.REJECTED ?? 0}</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Quick actions</p>
          <div className="mt-4 space-y-3">
            <Link href="/admin/kittens/new" className="block">
              <Button className="w-full">+ Add new kitten</Button>
            </Link>
            <Link href="/admin/kittens" className="block">
              <Button variant="secondary" className="w-full">Manage kittens</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Recent activity</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {pendingBuyers.map((buyer) => (
              <li key={buyer.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{buyer.user.name ?? buyer.user.email}</p>
                <p>{buyer.user.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div id="pending" className="scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Pending verifications</h2>
          <Badge variant="warning">{buyerMap.PENDING ?? 0} waiting</Badge>
        </div>
        <div className="mt-6 space-y-4">
          {pendingBuyers.length > 0 ? (
            pendingBuyers.map((buyer) => (
              <div key={buyer.id} className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold text-slate-900">{buyer.user.name ?? buyer.user.email}</p>
                  <p className="text-sm text-slate-600">{buyer.user.email} · {buyer.user.phone ?? 'No phone'}</p>
                  {buyer.proofAmount != null ? (
                    <p className="mt-2 text-sm text-slate-700">Funds declared: <span className="font-semibold">${buyer.proofAmount.toLocaleString()}</span></p>
                  ) : null}
                  {buyer.proofDescription ? (
                    <p className="mt-1 text-sm text-slate-600">Note: {buyer.proofDescription}</p>
                  ) : null}
                  <p className="mt-1 text-sm text-slate-500">Interested kittens: {buyer.kittensInterested.join(', ') || '—'}</p>

                  {/* Proof document — crosscheck before deciding */}
                  <div className="mt-3">
                    {buyer.proofViewUrl ? (
                      <a
                        href={buyer.proofViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-royal-300 bg-white px-4 py-2 text-sm font-semibold text-royal-700 transition hover:border-royal-500 hover:text-royal-800"
                      >
                        📄 View proof document
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {buyer.proofDescription ? 'No file — text proof only' : 'No proof document uploaded'}
                      </span>
                    )}
                  </div>
                </div>
                <VerificationActions buyerId={buyer.id} />
              </div>
            ))
          ) : (
            <p className="text-slate-600">No pending verification requests at this time.</p>
          )}
        </div>
      </div>
    </section>
  );
}

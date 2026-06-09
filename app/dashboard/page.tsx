import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSupabaseServer } from '@/lib/auth';
import { Badge } from '@/components/ui/Badge';
import { siteConfig } from '@/lib/seo';

const getBuyer = async () => {
  try {
    const supabase = getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;
    return await prisma.buyer.findUnique({
      where: { userId: userData.user.id },
      include: { user: true }
    });
  } catch {
    return null;
  }
};

export default async function DashboardPage() {
  const buyer = await getBuyer();

  if (!buyer) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard unavailable</h1>
        <p className="mt-4 text-slate-600">Please sign in or complete verification before accessing your dashboard.</p>
        <Link href="/auth/login" className="mt-6 inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-royal-600">Sign in</Link>
      </section>
    );
  }

  if (buyer.proofStatus === 'PENDING') {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Verification pending</h1>
        <p className="mt-4 text-slate-600">Your proof is under review. Check back soon for an update from the breeder.</p>
      </section>
    );
  }

  if (buyer.proofStatus === 'REJECTED') {
    return (
      <section className="rounded-[2rem] border border-red-200 bg-red-50 p-10 shadow-soft text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Verification rejected</h1>
        <p className="mt-4 text-slate-600">Reason: {buyer.rejectionReason ?? 'Not provided'}</p>
        <Link href="/verify-funds" className="mt-6 inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-royal-600">Upload new proof</Link>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">🎉 You're Verified!</h1>
        <p className="mt-4 text-slate-600">Welcome to Royal Maine Coon Cattery. Your buyer verification is approved.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-emerald-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Contact Breeder</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">Phone: <a href={siteConfig.phoneHref} className="text-royal-700">{siteConfig.phone}</a></p>
            <p className="text-sm text-slate-600">Email: <a href={`mailto:${siteConfig.email}`} className="text-royal-700">{siteConfig.email}</a></p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Next step</p>
            <p className="mt-3 text-slate-600">Schedule a video call to meet the kittens live and finalize your reservation.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-gradient-to-br from-royal-500 to-slate-900 p-8 text-white shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cream/80">Refer &amp; earn</p>
          <h2 className="mt-1 text-2xl font-semibold">Know another cat lover?</h2>
          <p className="mt-2 max-w-xl text-cream/90">Share your link — when a friend verifies, you both earn a reward toward a kitten.</p>
        </div>
        <Link href="/referrals" className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cream">
          Get my referral link
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Schedule Video Call</h2>
          <p className="mt-3 text-slate-600">Use our booking widget to reserve a time for a private video tour.</p>
          <div className="mt-6 aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-slate-200">
            <iframe
              src={process.env.NEXT_PUBLIC_CALENDLY_EMBED_URL ?? 'https://calendly.com/royal-maine-coon/video-call'}
              className="h-full w-full"
              title="Schedule video call"
              loading="lazy"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Kitten interests</h2>
            <div className="mt-4 space-y-4">
              {buyer.kittensInterested.length > 0 ? (
                buyer.kittensInterested.map((kittenId) => (
                  <div key={kittenId} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-700">Interested kitten ID: {kittenId}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">No kitten selected yet.</p>
              )}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <button className="inline-flex w-full items-center justify-center rounded-full bg-royal-500 px-6 py-4 text-base font-semibold text-white hover:bg-royal-600">Reserve Kitten</button>
            <button className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-900 hover:bg-slate-50">Upload New Proof</button>
          </div>
        </div>
      </div>
    </section>
  );
}

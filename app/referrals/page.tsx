import type { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/auth';
import {
  getOrCreateReferralCode,
  referralLink,
  syncAndGetReferrals,
  summarize,
  REFERRAL_REWARD_AMOUNT
} from '@/lib/referral';
import { CopyLink } from '@/components/referral/CopyLink';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Refer a Friend',
  description: 'Share Royal Maine Coon Cattery with fellow cat lovers and earn rewards when they adopt.',
  robots: { index: false, follow: false }
};

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  QUALIFIED: 'bg-emerald-50 text-emerald-700',
  REWARDED: 'bg-royal-100 text-royal-800',
  CANCELLED: 'bg-slate-100 text-slate-500'
};

const statusLabel: Record<string, string> = {
  PENDING: 'Applied',
  QUALIFIED: 'Verified — reward earned',
  REWARDED: 'Reward issued',
  CANCELLED: 'Cancelled'
};

export default async function ReferralsPage() {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Refer a friend</h1>
        <p className="mt-4 text-slate-600">Sign in to get your referral link and start earning rewards.</p>
        <Link href="/auth/login" className="mt-6 inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-royal-600">
          Sign in
        </Link>
      </section>
    );
  }

  const code = await getOrCreateReferralCode(userData.user.id);
  const link = referralLink(code);
  const referrals = await syncAndGetReferrals(userData.user.id);
  const stats = summarize(referrals);
  const reward = `$${REFERRAL_REWARD_AMOUNT}`;

  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="rounded-[2rem] bg-gradient-to-br from-royal-500 to-slate-900 p-10 text-white shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-cream/80">Refer & earn</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Give {reward}, get {reward}</h1>
        <p className="mt-4 max-w-2xl text-cream/90">
          Know someone who would love a Maine Coon? Share your link. When your friend completes verification,
          they get <strong>{reward}</strong> toward their kitten and you earn a <strong>{reward}</strong> reward.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm text-cream/80">1. Share</p>
            <p className="mt-1 font-semibold">Send your personal link to friends.</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm text-cream/80">2. They apply</p>
            <p className="mt-1 font-semibold">Your friend applies and verifies.</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm text-cream/80">3. You earn</p>
            <p className="mt-1 font-semibold">{reward} reward once they&apos;re verified.</p>
          </div>
        </div>
      </div>

      {/* Share link */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">Your referral link</h2>
        <p className="mt-2 text-slate-600">
          Your code is <span className="font-mono font-semibold text-royal-700">{code}</span>. Share the link below —
          we&apos;ll track everyone who applies through it.
        </p>
        <div className="mt-6">
          <CopyLink link={link} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Friends applied', value: stats.pending + stats.qualified + stats.rewarded },
          { label: 'Pending', value: stats.pending },
          { label: 'Verified', value: stats.qualified + stats.rewarded },
          { label: 'Total earned', value: `$${stats.totalEarned}` }
        ].map((s) => (
          <div key={s.label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-3xl font-semibold text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Referral list */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">Your referrals</h2>
        {referrals.length === 0 ? (
          <p className="mt-4 text-slate-600">
            No referrals yet. Share your link above to get started — your rewards will show up here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-slate-100">
            {referrals.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">
                    {r.referredUser?.name ?? r.referredEmail ?? 'A friend'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Applied {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(r.createdAt)}
                    {r.rewardAmount ? ` • ${reward} reward` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[r.status] ?? statusStyles.PENDING}`}>
                  {statusLabel[r.status] ?? r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

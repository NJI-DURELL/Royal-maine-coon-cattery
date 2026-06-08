import { prisma } from '@/lib/db';
import { siteConfig } from '@/lib/seo';

export const REFERRAL_COOKIE = 'rmc_ref';

/** Reward granted to the referrer once a referred friend completes verification. */
export const REFERRAL_REWARD_AMOUNT = Number(process.env.NEXT_PUBLIC_REFERRAL_REWARD ?? 150);

// Unambiguous alphabet (no 0/O/1/I) for easy verbal/written sharing.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const randomCode = (length = 7) =>
  Array.from({ length }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

/** Return the user's referral code, generating and persisting one if missing. */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (user?.referralCode) return user.referralCode;

  // Retry on the rare unique collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    try {
      await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
      return code;
    } catch {
      // collision — try a new code
    }
  }
  throw new Error('Could not generate a unique referral code');
}

export const referralLink = (code: string) => `${siteConfig.url}/r/${code}`;

/**
 * Attribute a newly-applied user to the referrer who owns `code`.
 * Idempotent and self-protecting: ignores missing/unknown codes and self-referrals,
 * and never overwrites an existing attribution.
 */
export async function attachReferral(referredUserId: string, code: string | undefined, referredEmail?: string) {
  if (!code) return;

  const referrer = await prisma.user.findUnique({ where: { referralCode: code }, select: { id: true } });
  if (!referrer || referrer.id === referredUserId) return;

  const existing = await prisma.referral.findUnique({ where: { referredUserId } });
  if (existing) return;

  await prisma.referral.create({
    data: { referrerId: referrer.id, referredUserId, referredEmail, status: 'PENDING' }
  });
}

/**
 * Promote a referrer's PENDING referrals to QUALIFIED once the referred friend's
 * buyer verification is APPROVED. Runs lazily on dashboard load so no approval
 * hook is required. Returns the referrer's current referral list.
 */
export async function syncAndGetReferrals(referrerId: string) {
  const pending = await prisma.referral.findMany({
    where: { referrerId, status: 'PENDING', referredUserId: { not: null } },
    include: { referredUser: { include: { buyer: { select: { proofStatus: true } } } } }
  });

  const toQualify = pending.filter((r) => r.referredUser?.buyer?.proofStatus === 'APPROVED');
  if (toQualify.length > 0) {
    await prisma.$transaction(
      toQualify.map((r) =>
        prisma.referral.update({
          where: { id: r.id },
          data: { status: 'QUALIFIED', qualifiedAt: new Date(), rewardAmount: REFERRAL_REWARD_AMOUNT }
        })
      )
    );
  }

  return prisma.referral.findMany({
    where: { referrerId },
    orderBy: { createdAt: 'desc' },
    include: { referredUser: { select: { name: true, email: true } } }
  });
}

export type ReferralStats = {
  pending: number;
  qualified: number;
  rewarded: number;
  totalEarned: number;
};

export function summarize(referrals: { status: string; rewardAmount: number | null }[]): ReferralStats {
  const stats: ReferralStats = { pending: 0, qualified: 0, rewarded: 0, totalEarned: 0 };
  for (const r of referrals) {
    if (r.status === 'PENDING') stats.pending++;
    if (r.status === 'QUALIFIED') {
      stats.qualified++;
      stats.totalEarned += r.rewardAmount ?? 0;
    }
    if (r.status === 'REWARDED') {
      stats.rewarded++;
      stats.totalEarned += r.rewardAmount ?? 0;
    }
  }
  return stats;
}

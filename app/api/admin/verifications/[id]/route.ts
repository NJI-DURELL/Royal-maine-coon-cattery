import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendRejectionEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const actionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().max(500).optional()
});

// PATCH /api/admin/verifications/[id]  — [id] is the Buyer id.
// Approving a buyer also lets their referrer's pending referral qualify
// (handled lazily on the referrals dashboard via proofStatus === APPROVED).
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const parsed = actionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const isApprove = parsed.data.action === 'APPROVE';
  const reason = parsed.data.reason ?? 'Not specified';

  const buyer = await prisma.buyer
    .update({
      where: { id: params.id },
      data: {
        proofStatus: isApprove ? 'APPROVED' : 'REJECTED',
        verifiedAt: isApprove ? new Date() : null,
        rejectionReason: isApprove ? null : reason
      },
      include: { user: { select: { email: true, name: true } } }
    })
    .catch(() => null);

  if (!buyer) {
    return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
  }

  // Notify the buyer of a rejection with the reason. Best-effort — a mail failure
  // must never block the rejection from being recorded.
  if (!isApprove && buyer.user?.email) {
    await sendRejectionEmail({ to: buyer.user.email, name: buyer.user.name, reason });
  }

  return NextResponse.json({ buyer });
}

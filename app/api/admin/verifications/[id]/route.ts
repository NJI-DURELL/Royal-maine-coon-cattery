import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

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
  const buyer = await prisma.buyer
    .update({
      where: { id: params.id },
      data: {
        proofStatus: isApprove ? 'APPROVED' : 'REJECTED',
        verifiedAt: isApprove ? new Date() : null,
        rejectionReason: isApprove ? null : parsed.data.reason ?? 'Not specified'
      }
    })
    .catch(() => null);

  if (!buyer) {
    return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
  }
  return NextResponse.json({ buyer });
}

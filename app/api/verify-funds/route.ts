import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { attachReferral, REFERRAL_COOKIE } from '@/lib/referral';
import { sendBreederNotification } from '@/lib/email';

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const user = userData.user;
  const {
    fullName,
    email,
    phone,
    location,
    country,
    kittenIds,
    proofUrl,
    proofDescription,
    proofAmount,
    transportationPlan,
    deliveryLocation,
    hasVet,
    monthlyBudget,
    housingSituation,
    familyApproval,
    agreementVideoCall,
    agreementDeposit,
    agreementTerms
  } = body;

  const storedUser = await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email ?? email,
      passwordHash: 'supabase-auth',
      name: fullName,
      phone,
      location,
      country,
      role: 'USER'
    },
    update: {
      email: user.email ?? email,
      name: fullName,
      phone,
      location,
      country
    }
  });

  await prisma.buyer.upsert({
    where: { userId: storedUser.id },
    create: {
      userId: storedUser.id,
      proofUrl: proofUrl ?? null,
      proofDescription: proofDescription ?? null,
      proofAmount,
      proofStatus: 'PENDING',
      transportationPlan,
      deliveryLocation: deliveryLocation ?? null,
      hasVet,
      monthlyBudget,
      housingSituation,
      familyApproval,
      agreementVideoCall,
      agreementDeposit,
      agreementTerms,
      kittensInterested: kittenIds
    },
    update: {
      proofUrl: proofUrl ?? null,
      proofDescription: proofDescription ?? null,
      proofAmount,
      proofStatus: 'PENDING',
      rejectionReason: null,
      transportationPlan,
      deliveryLocation: deliveryLocation ?? null,
      hasVet,
      monthlyBudget,
      housingSituation,
      familyApproval,
      agreementVideoCall,
      agreementDeposit,
      agreementTerms,
      kittensInterested: kittenIds
    }
  });

  // Attribute this applicant to the referrer whose link they arrived through.
  const referralCode = cookies().get(REFERRAL_COOKIE)?.value;
  if (referralCode) {
    try {
      await attachReferral(storedUser.id, referralCode, storedUser.email);
    } catch {
      // Referral attribution is best-effort — never block verification on it.
    }
  }

  // Notify the breeder of the new submission. Best-effort — a mail failure must
  // never block verification, so we don't await-throw on it.
  await sendBreederNotification({
    fullName,
    email: user.email ?? email,
    phone,
    location,
    country,
    proofAmount,
    kittenIds,
    proofUrl,
    proofDescription
  });

  return NextResponse.json({ success: true });
}

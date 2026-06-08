import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { attachReferral, REFERRAL_COOKIE } from '@/lib/referral';

// TODO: Implement Resend email notifications when compatibility issues are resolved
// const resendApiKey = process.env.RESEND_API_KEY;
// const resendFrom = process.env.RESEND_FROM;
// const breederEmail = process.env.BREEDER_EMAIL;

// if (!resendApiKey || !resendFrom || !breederEmail) {
//   throw new Error('Missing Resend email settings');
// }

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

  // TODO: Enable Resend email notifications
  // const resend = new Resend(resendApiKey);
  // await resend.emails.send({
  //   from: resendFrom,
  //   to: breederEmail,
  //   subject: 'New proof of funds submitted',
  //   html: `<h1>New verification request</h1>
  //     <p><strong>${fullName}</strong> has submitted proof of funds for review.</p>
  //     <p>Email: ${email}</p>
  //     <p>Phone: ${phone}</p>
  //     <p>Amount available: $${proofAmount}</p>
  //     <p>Interested kittens: ${kittenIds.join(', ')}</p>
  //     <p>Proof document: ${proofUrl ?? 'No file uploaded'}</p>`
  // });

  return NextResponse.json({ success: true });
}

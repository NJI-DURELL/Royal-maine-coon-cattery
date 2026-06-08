import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signupSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// Server-side signup that creates the user already email-confirmed via the admin
// API. This bypasses Supabase's confirmation email entirely, so signup works even
// when no working mail provider is configured. (Buyers are still vetted through the
// funds-verification + video-call step before any kitten is placed.)
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'Signup is temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }

  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
  }

  const { email, password, name, phone, location, country } = parsed.data;

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, phone, location, country }
  });

  if (error) {
    const alreadyExists = /already|registered|exists/i.test(error.message);
    return NextResponse.json(
      {
        error: alreadyExists
          ? 'An account with this email already exists. Try signing in instead.'
          : error.message
      },
      { status: alreadyExists ? 409 : 400 }
    );
  }

  return NextResponse.json({ success: true });
}

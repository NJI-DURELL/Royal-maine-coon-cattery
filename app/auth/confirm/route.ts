import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseServer } from '@/lib/auth';

// Email confirmation via token hash (verifyOtp). Unlike the PKCE code flow, this
// carries no device-bound secret, so a link opened on a *different* device (e.g.
// signed up on a PC, confirmed on a phone) still works. Point the Supabase
// "Confirm signup" email template here:
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/verify-funds';

  if (tokenHash && type) {
    const supabase = getSupabaseServer();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/auth/auth-error?reason=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/auth/auth-error?reason=missing_token`);
}

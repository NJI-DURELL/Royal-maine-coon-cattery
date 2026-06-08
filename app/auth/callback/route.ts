import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/auth';

// Supabase redirects here after a user clicks the email confirmation (or recovery)
// link. We exchange the one-time code for a real session cookie, then send the user
// on. Any failure goes to a friendly error page instead of leaving raw error params
// sitting in the URL.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/verify-funds';
  const errorDescription = searchParams.get('error_description') ?? searchParams.get('error');

  if (errorDescription) {
    return NextResponse.redirect(`${origin}/auth/auth-error?reason=${encodeURIComponent(errorDescription)}`);
  }

  if (code) {
    const supabase = getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/auth/auth-error?reason=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/auth/auth-error?reason=missing_code`);
}

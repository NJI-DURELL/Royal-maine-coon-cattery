import { NextResponse } from 'next/server';
import { REFERRAL_COOKIE } from '@/lib/referral';
import { siteConfig } from '@/lib/seo';

// Share links look like https://site/r/ABC1234 — store the code and send the
// visitor to the kittens page to start browsing.
export function GET(_request: Request, { params }: { params: { code: string } }) {
  const code = params.code?.trim().toUpperCase().slice(0, 16);
  const response = NextResponse.redirect(new URL('/kittens', siteConfig.url));

  if (code) {
    response.cookies.set(REFERRAL_COOKIE, code, {
      maxAge: 60 * 60 * 24 * 60, // 60 days
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    });
  }

  return response;
}

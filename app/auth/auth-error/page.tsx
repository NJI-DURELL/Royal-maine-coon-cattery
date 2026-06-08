import Link from 'next/link';

export const dynamic = 'force-dynamic';

const FRIENDLY: Record<string, string> = {
  missing_code: 'That confirmation link is incomplete or was already used.',
  otp_expired: 'That link has expired. Confirmation links are only valid for a short time.',
  access_denied: 'That link is no longer valid. Please request a new one.'
};

function friendlyMessage(reason?: string) {
  if (!reason) return 'Something went wrong while confirming your account.';
  for (const key of Object.keys(FRIENDLY)) {
    if (reason.toLowerCase().includes(key)) return FRIENDLY[key];
  }
  return reason;
}

export default function AuthErrorPage({ searchParams }: { searchParams: { reason?: string } }) {
  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">⚠️</div>
      <h1 className="mt-5 text-3xl font-semibold text-slate-900">We couldn&apos;t confirm that link</h1>
      <p className="mt-3 text-slate-600">{friendlyMessage(searchParams.reason)}</p>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link href="/auth/signup" className="inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-royal-600">
          Create a new link
        </Link>
        <Link href="/auth/login" className="text-sm font-semibold text-royal-700 hover:text-royal-800">
          Back to sign in
        </Link>
      </div>
    </section>
  );
}

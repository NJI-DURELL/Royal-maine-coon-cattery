'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Route-level error boundary. Catches runtime errors thrown while rendering any
// page within the root layout (the Navbar/Footer chrome stays intact).
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface for logging/monitoring; replace with your error reporter in production.
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-soft">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">😿</div>
      <h1 className="mt-5 text-3xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-slate-600">
        We hit an unexpected error. You can try again, or head back home while we sort it out.
      </p>
      {error.digest ? <p className="mt-2 text-xs text-slate-400">Reference: {error.digest}</p> : null}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-royal-600"
        >
          Try again
        </button>
        <Link href="/" className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-royal-500 hover:text-royal-700">
          Back home
        </Link>
      </div>
    </section>
  );
}

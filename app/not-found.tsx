import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-soft">
      <p className="text-6xl font-semibold text-royal-500">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">This page wandered off</h1>
      <p className="mt-3 text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back to the kittens.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/" className="inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-royal-600">
          Back home
        </Link>
        <Link href="/kittens" className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-royal-500 hover:text-royal-700">
          Browse available kittens
        </Link>
      </div>
    </section>
  );
}

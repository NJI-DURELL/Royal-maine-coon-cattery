import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-4xl font-semibold text-slate-900">Proof submitted successfully!</h1>
        <p className="text-lg leading-8 text-slate-600">Our breeder team will review your information within 24 hours. You can expect an email update and next steps for scheduling your private kitten video call.</p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-royal-600">Back to home</Link>
          <Link href="/dashboard" className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Go to dashboard</Link>
        </div>
      </div>
    </section>
  );
}

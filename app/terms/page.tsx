import { siteConfig } from '@/lib/seo';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern use of Royal Maine Coon Cattery and the adoption process.'
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-slate-900">Terms of Service</h1>
      <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
      <div className="space-y-4 text-slate-600">
        <h2 className="text-lg font-semibold text-slate-900">Using this site</h2>
        <p>
          By creating an account and applying to adopt, you agree to provide accurate information and to complete
          the buyer verification process. Submitting an application does not reserve a kitten until confirmed by us.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Deposits &amp; adoptions</h2>
        <p>
          Reservations are confirmed once a deposit is received and acknowledged. Specific deposit, health-guarantee,
          and delivery terms are provided in your adoption agreement before any payment is due.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Referrals</h2>
        <p>
          Referral rewards are issued when a referred friend completes verification, subject to our review. We may
          adjust or end the referral program at any time.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
        <p>
          Questions about these terms? Email{' '}
          <a href={`mailto:${siteConfig.email}`} className="font-semibold text-royal-700 hover:text-royal-800">{siteConfig.email}</a>.
        </p>
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          This is a starting template. Please have it reviewed for your jurisdiction before relying on it legally.
        </p>
      </div>
    </section>
  );
}

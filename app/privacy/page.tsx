import { siteConfig } from '@/lib/seo';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Royal Maine Coon Cattery collects, uses, and protects your information.'
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
      <div className="space-y-4 text-slate-600">
        <p>
          Royal Maine Coon Cattery (&quot;we&quot;) respects your privacy. This page explains what we collect and why.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Information we collect</h2>
        <p>
          When you create an account or apply to adopt, we collect details you provide — such as your name, email,
          phone, location, and the verification information needed to process an adoption. We use a third-party
          authentication provider to manage sign-in securely.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">How we use it</h2>
        <p>
          We use your information solely to review applications, communicate about kittens and adoptions, arrange
          delivery, and operate our referral program. We do not sell your personal information.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Your choices</h2>
        <p>
          You may request access to or deletion of your data at any time by emailing{' '}
          <a href={`mailto:${siteConfig.email}`} className="font-semibold text-royal-700 hover:text-royal-800">{siteConfig.email}</a>.
        </p>
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          This is a starting template. Please have it reviewed for your jurisdiction before relying on it legally.
        </p>
      </div>
    </section>
  );
}

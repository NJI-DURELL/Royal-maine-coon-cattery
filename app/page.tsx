import Link from 'next/link';
import { prisma } from '@/lib/db';
import { KittenCard } from '@/components/kitten/KittenCard';
import { Badge } from '@/components/ui/Badge';
import { faqSchema, JsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const getFeaturedKittens = async () => {
  try {
    return await prisma.kitten.findMany({
      where: { status: 'AVAILABLE' },
      orderBy: { createdAt: 'desc' },
      take: 4
    });
  } catch {
    return [];
  }
};

const faqs = [
  {
    question: 'Are your Maine Coon kittens purebred and registered?',
    answer:
      'Yes. Every kitten comes from registered Maine Coon bloodlines with multi-generation pedigree documentation. You receive the paperwork before your kitten travels home.'
  },
  {
    question: 'What health guarantees come with each kitten?',
    answer:
      'Each kitten is vaccinated, dewormed, microchipped, and wellness-checked by a licensed vet before adoption, and is screened for the genetic markers common to the breed (HCM and SMA). A written health guarantee is included.'
  },
  {
    question: 'Why do I have to verify funds before a video call?',
    answer:
      'Verification keeps the process serious and fair for everyone. It confirms you are ready to adopt before we reserve a kitten and schedule a private viewing, so available kittens are never held back from committed families.'
  },
  {
    question: 'How does delivery work?',
    answer:
      'You can choose flight nanny delivery for door-to-door arrival, or breeder pickup delivery to an agreed safe location near you. We help you plan transport, diet, and a smooth transition home.'
  },
  {
    question: 'Can I meet the kitten before I commit?',
    answer:
      'Yes. After verification we schedule a live video call so you can see your kitten, meet the breeder, and ask anything before placing a deposit.'
  }
];

export default async function HomePage() {
  const kittens = await getFeaturedKittens();

  return (
    <section className="space-y-20">
      <JsonLd data={faqSchema(faqs)} />

      {/* Hero */}
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-6 rounded-[2rem] bg-white p-10 shadow-soft">
          <Badge className="w-fit">Licensed Maine Coon Cattery</Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Gentle giants, raised right — purebred Maine Coon kittens for life.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Health-tested, pedigree kittens socialized in our home from day one. Apply to adopt, verify, and
              meet your kitten on a private video call before you ever place a deposit.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/kittens">
              <button className="btn-wide inline-flex items-center justify-center rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-royal-600">
                Meet Available Kittens
              </button>
            </Link>
            <Link href="/verify-funds">
              <button className="btn-wide inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-royal-500 hover:text-royal-700">
                Start Your Application
              </button>
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            Pedigree papers, vaccinations, microchip, and a written health guarantee included with every kitten.
          </p>
        </div>

        {/* Trust panel */}
        <div className="grid gap-4">
          <div className="rounded-[2rem] bg-gradient-to-br from-royal-500 to-slate-900 p-8 text-white shadow-soft">
            <h2 className="text-3xl font-semibold">Why families choose us</h2>
            <p className="mt-4 text-base leading-8 text-cream/90">
              We place a small number of kittens each year so every one leaves confident, healthy, and ready to
              bond. No catteries-in-bulk, no guesswork — just careful breeding and honest support.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold">100%</p>
                <p className="text-sm text-cream/90">Vet-checked & vaccinated before adoption</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold">HCM + SMA</p>
                <p className="text-sm text-cream/90">Genetic screening on our breeding lines</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold">2 ways</p>
                <p className="text-sm text-cream/90">Flight nanny or breeder pickup delivery</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold">Lifetime</p>
                <p className="text-sm text-cream/90">Breeder support after you bring them home</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured kittens */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Available now</p>
            <h2 className="text-3xl font-semibold text-slate-900">Kittens looking for their forever homes</h2>
          </div>
          <Link href="/kittens" className="text-sm font-semibold text-royal-700 hover:text-royal-800">
            View all kittens →
          </Link>
        </div>
        {kittens.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kittens.map((kitten) => (
              <KittenCard key={kitten.id} kitten={kitten} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600">
            Our next litter is on the way. <Link href="/verify-funds" className="font-semibold text-royal-700 hover:text-royal-800">Apply now</Link> to join the waitlist.
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Simple & transparent</p>
          <h2 className="text-3xl font-semibold text-slate-900">How adoption works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Four steps from browsing to bringing your Maine Coon home. No pressure, no surprises.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { step: '01', title: 'Choose your kitten', body: 'Browse available kittens and pick the one who feels like family.' },
            { step: '02', title: 'Apply & verify', body: 'Complete a short application and fund verification so we can reserve your kitten.' },
            { step: '03', title: 'Meet on video', body: 'See your kitten live, meet the breeder, and ask every question you have.' },
            { step: '04', title: 'Welcome them home', body: 'Place your deposit, choose delivery, and prepare for your gentle giant.' }
          ].map((s) => (
            <div key={s.step} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <span className="text-sm font-semibold text-royal-500">{s.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery options */}
      <section className="grid gap-6 rounded-[2rem] bg-white p-8 shadow-soft lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-center gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Getting them home</p>
          <h2 className="text-3xl font-semibold text-slate-900">Delivery that fits your family</h2>
          <p className="text-slate-600">
            Pick the arrival experience that works for you. Whichever you choose, we handle the details and keep
            your kitten calm and cared for in transit.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Flight nanny', body: 'Door-to-door arrival with a dedicated nanny for careful, stress-free travel.' },
            { title: 'Pickup delivery', body: 'We bring your kitten to a safe, agreed location near you.' }
          ].map((d) => (
            <div key={d.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">{d.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials — REPLACE with real, verifiable reviews before launch */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Happy homes</p>
          <h2 className="text-3xl font-semibold text-slate-900">What our families say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { quote: 'The video call sealed it for us — we saw exactly who we were adopting. He arrived healthy, happy, and huge.', name: 'The Daniels Family' },
            { quote: 'Every question answered, every step explained. The pedigree and health records were all there waiting for us.', name: 'Marisol R.' },
            { quote: 'Our nanny delivery was flawless. She stepped out of the carrier purring. Best decision we made all year.', name: 'James & Priya' }
          ].map((t) => (
            <figure key={t.name} className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <blockquote className="text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="text-sm font-semibold text-royal-700">— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Good to know</p>
          <h2 className="text-3xl font-semibold text-slate-900">Frequently asked questions</h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-royal-500 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-royal-700 p-10 text-center text-white shadow-soft">
        <h2 className="text-3xl font-semibold sm:text-4xl">Your gentle giant is waiting</h2>
        <p className="mx-auto mt-3 max-w-2xl text-cream/90">
          Available kittens go quickly. Start your application today and meet yours on a private video call.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/kittens">
            <button className="btn-wide inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cream">
              Meet Available Kittens
            </button>
          </Link>
          <Link href="/verify-funds">
            <button className="btn-wide inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Start Your Application
            </button>
          </Link>
        </div>
      </section>
    </section>
  );
}

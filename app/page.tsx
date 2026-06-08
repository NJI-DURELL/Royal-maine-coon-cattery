import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';
import { prisma } from '@/lib/db';
import { KittenCard } from '@/components/kitten/KittenCard';
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

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Confident Temperament',
    body: 'Raised underfoot in our home and handled from day one, so kittens arrive social, calm, and bonded to people.'
  },
  {
    icon: Sparkles,
    title: 'Pedigreed Lineage',
    body: 'Registered European bloodlines with full multi-generation pedigree documentation for every kitten.'
  },
  {
    icon: HeartHandshake,
    title: 'Striking, Healthy Beauty',
    body: 'Vet-checked, vaccinated, and genetically screened — the grand looks of the breed backed by real health.'
  }
];

export default async function HomePage() {
  const kittens = await getFeaturedKittens();
  const heroKitten = kittens[0];

  return (
    <div className="space-y-20">
      <JsonLd data={faqSchema(faqs)} />

      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-silk p-8 sm:p-12 lg:p-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-royal-500/40 bg-royal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-royal-300">
              Licensed Maine Coon Cattery
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
              A Companion
              <br />
              Like <span className="accent">No Other</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-cream/80">
              Purebred, health-tested Maine Coons raised with pedigree care in our home. Apply to adopt, verify,
              and meet your gentle giant on a private video call before you ever place a deposit.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/kittens">
                <button className="btn-wide inline-flex items-center justify-center gap-2 rounded-full bg-royal-500 px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-royal-400">
                  Meet Available Kittens <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/verify-funds">
                <button className="btn-wide inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-royal-400 hover:text-royal-300">
                  Start Your Application
                </button>
              </Link>
            </div>
            <p className="text-sm text-cream/55">
              Pedigree papers · vaccinations · microchip · written health guarantee — included with every kitten.
            </p>
          </div>

          {/* Framed showcase image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-royal-500/30 bg-ink-800 shadow-gold">
              {heroKitten ? (
                <Image
                  src={heroKitten.mainImageUrl}
                  alt={`${heroKitten.name}, a purebred Maine Coon kitten available for adoption`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-cream/60">
                  <Sparkles className="h-10 w-10 text-royal-400" />
                  <p className="font-display text-2xl text-white">New litter coming soon</p>
                  <p className="text-sm">Apply now to join the waitlist.</p>
                </div>
              )}
            </div>
            {heroKitten ? (
              <Link
                href={`/kittens/${heroKitten.id}`}
                className="absolute -bottom-4 left-6 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink shadow-soft transition hover:bg-white"
              >
                Meet {heroKitten.name} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* ───────────────── Trust strip ───────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { stat: '100%', label: 'Vet-checked & vaccinated' },
          { stat: 'HCM · SMA', label: 'Genetic screening' },
          { stat: '2 ways', label: 'Nanny or pickup delivery' },
          { stat: 'Lifetime', label: 'Breeder support' }
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-soft">
            <p className="font-display text-2xl font-semibold text-royal-700">{item.stat}</p>
            <p className="mt-1 text-sm text-slate-600">{item.label}</p>
          </div>
        ))}
      </section>

      {/* ───────────────── Available kittens ───────────────── */}
      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Available now</p>
            <h2 className="mt-1 font-display text-4xl font-semibold text-slate-900">
              Little Ones <span className="accent">Waiting</span> for Home
            </h2>
          </div>
          <Link href="/kittens" className="inline-flex items-center gap-1 text-sm font-semibold text-royal-700 hover:gap-2 hover:text-royal-800">
            View all kittens <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {kittens.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {kittens.map((kitten) => (
              <KittenCard key={kitten.id} kitten={kitten} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/60 p-12 text-center text-slate-600">
            Our next litter is on the way.{' '}
            <Link href="/verify-funds" className="font-semibold text-royal-700 hover:text-royal-800">Apply now</Link> to join the waitlist.
          </div>
        )}
      </section>

      {/* ───────────────── Story / pillars (dark) ───────────────── */}
      <section className="overflow-hidden rounded-[2.5rem] bg-silk p-8 sm:p-12 lg:p-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-300">Our story</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-white">
            Specializing <span className="accent">exclusively</span> in Maine Coons
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-cream/75">
            We place a small number of kittens each year so every one leaves confident, healthy, and ready to bond.
            No volume breeding — just careful pairings and honest support for the life of your cat.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-royal-500/15 text-royal-300">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-cream/70">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── How it works ───────────────── */}
      <section className="space-y-10">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Simple & transparent</p>
          <h2 className="mt-1 font-display text-4xl font-semibold text-slate-900">
            How Adoption <span className="accent">Works</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Four steps from browsing to bringing your Maine Coon home. No pressure, no surprises.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { step: '01', title: 'Choose your kitten', body: 'Browse available kittens and pick the one who feels like family.' },
            { step: '02', title: 'Apply & verify', body: 'Complete a short application and fund verification so we can reserve your kitten.' },
            { step: '03', title: 'Meet on video', body: 'See your kitten live, meet the breeder, and ask every question you have.' },
            { step: '04', title: 'Welcome them home', body: 'Place your deposit, choose delivery, and prepare for your gentle giant.' }
          ].map((s) => (
            <div key={s.step} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
              <span className="font-display text-3xl font-semibold text-royal-400">{s.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── Delivery ───────────────── */}
      <section className="grid gap-6 rounded-[2.5rem] bg-white p-8 shadow-soft sm:p-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-center gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Getting them home</p>
          <h2 className="font-display text-4xl font-semibold text-slate-900">
            Delivery That <span className="accent">Fits</span> Your Family
          </h2>
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
            <div key={d.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="font-display text-xl font-semibold text-slate-900">{d.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── Testimonials (dark) ───────────────── */}
      <section className="overflow-hidden rounded-[2.5rem] bg-silk p-8 sm:p-12 lg:p-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-300">Happy homes</p>
          <h2 className="mt-1 font-display text-4xl font-semibold text-white">
            What Our <span className="accent">Families</span> Say
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { quote: 'The video call sealed it for us — we saw exactly who we were adopting. He arrived healthy, happy, and huge.', name: 'The Daniels Family' },
            { quote: 'Every question answered, every step explained. The pedigree and health records were all there waiting for us.', name: 'Marisol R.' },
            { quote: 'Our nanny delivery was flawless. She stepped out of the carrier purring. Best decision we made all year.', name: 'James & Priya' }
          ].map((t) => (
            <figure key={t.name} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
              <blockquote className="font-display text-lg italic leading-relaxed text-cream/90">“{t.quote}”</blockquote>
              <figcaption className="text-sm font-semibold text-royal-300">— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Good to know</p>
          <h2 className="mt-1 font-display text-4xl font-semibold text-slate-900">
            Frequently Asked <span className="accent">Questions</span>
          </h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-xl text-royal-500 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────────────── Final CTA (dark) ───────────────── */}
      <section className="overflow-hidden rounded-[2.5rem] bg-silk p-10 text-center sm:p-16">
        <p className="text-sm uppercase tracking-[0.3em] text-royal-300">Get in touch</p>
        <h2 className="mx-auto mt-2 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
          Looking for a <span className="accent">Maine Coon?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-cream/75">
          Available kittens go quickly. Start your application today and meet yours on a private video call.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/kittens">
            <button className="btn-wide inline-flex items-center justify-center gap-2 rounded-full bg-royal-500 px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-royal-400">
              Meet Available Kittens <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/verify-funds">
            <button className="btn-wide inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-royal-400 hover:text-royal-300">
              Start Your Application
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

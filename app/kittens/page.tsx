import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { KittenGallery } from '@/components/kitten/KittenGallery';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Available Maine Coon Kittens for Adoption',
  description:
    'Browse purebred Maine Coon kittens available for adoption. Filter by color, gender, age, and price. Every kitten is health-tested, vaccinated, microchipped, and raised in a home.',
  alternates: { canonical: '/kittens' }
};

const getAllKittens = async () => {
  try {
    return await prisma.kitten.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {
    return [];
  }
};

export default async function KittensPage() {
  const kittens = await getAllKittens();

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-[2.5rem] bg-silk p-8 shadow-soft sm:p-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-royal-300">Maine Coon kittens</p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Purebred Kittens <span className="accent">Available</span> for Adoption
          </h1>
          <p className="max-w-3xl text-cream/75">Filter by age, color, gender, and status. Every kitten is raised in a home environment and comes with full health assurances.</p>
        </div>
      </div>
      <KittenGallery kittens={kittens} />
    </section>
  );
}

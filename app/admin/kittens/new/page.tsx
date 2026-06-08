import Link from 'next/link';
import { KittenForm } from '@/components/admin/KittenForm';

export const metadata = { title: 'Add a kitten' };

export default function NewKittenPage() {
  return (
    <section className="space-y-6">
      <nav className="text-sm text-slate-500">
        <Link href="/admin" className="hover:text-royal-700">Admin</Link>
        <span className="mx-2">/</span>
        <Link href="/admin/kittens" className="hover:text-royal-700">Kittens</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">New</span>
      </nav>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Add a new kitten</h1>
        <p className="mt-2 text-slate-600">Upload a photo and fill in the details. The kitten appears on the site once saved as Available.</p>
        <div className="mt-8">
          <KittenForm />
        </div>
      </div>
    </section>
  );
}

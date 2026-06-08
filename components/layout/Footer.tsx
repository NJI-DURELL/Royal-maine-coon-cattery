import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8 text-sm text-slate-600">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Royal Maine Coon Cattery. Licensed breeder with health-tested purebred Maine Coon kittens.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-royal-700">Privacy</Link>
          <Link href="/terms" className="hover:text-royal-700">Terms</Link>
          <Link href="/contact" className="hover:text-royal-700">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

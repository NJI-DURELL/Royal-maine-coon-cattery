'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/utils';

const links = [
  { href: '/kittens', label: 'Kittens' },
  { href: '/verify-funds', label: 'Apply to Adopt' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 -mx-4 border-b border-slate-200/70 bg-cream/80 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl text-lg font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500 focus-visible:ring-offset-2"
          onClick={() => setOpen(false)}
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-royal-500 text-white">RM</span>
          <span className="hidden sm:inline">Royal Maine Coon Cattery</span>
          <span className="sm:hidden">Royal Maine Coon</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'rounded-full px-2 py-1 text-sm font-medium transition hover:text-royal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500',
                isActive(link.href) ? 'text-royal-700' : 'text-slate-700'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/auth/login">
            <Button variant="secondary">Sign In</Button>
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-royal-500 hover:text-royal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={cn(
          'overflow-hidden transition-[max-height] duration-300 ease-out md:hidden',
          open ? 'max-h-80' : 'max-h-0'
        )}
      >
        <div className="flex flex-col gap-1 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'rounded-2xl px-4 py-3 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500',
                isActive(link.href) ? 'bg-royal-50 text-royal-700' : 'text-slate-700 hover:bg-white'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-full bg-royal-500 px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-royal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500"
          >
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}

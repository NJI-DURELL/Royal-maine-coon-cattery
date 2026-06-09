'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Settings, Gift, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { cn } from '@/components/ui/utils';

type MenuUser = { name: string | null; email: string | null };

function initialsFrom(name?: string | null, email?: string | null) {
  const n = (name ?? '').trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    return (parts.length >= 2 ? parts[0][0] + parts[1][0] : n.slice(0, 2)).toUpperCase();
  }
  const local = (email ?? '').split('@')[0];
  return (local.slice(0, 2) || 'RM').toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<MenuUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadRole = () =>
      fetch('/api/auth/user')
        .then((r) => r.json())
        .then((d) => mounted && setIsAdmin(d?.user?.role === 'ADMIN'))
        .catch(() => {});

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ? { name: (data.user.user_metadata?.name as string) ?? null, email: data.user.email ?? null } : null);
      setLoading(false);
      if (data.user) loadRole();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAdmin(false);
      if (session?.user) {
        setUser({ name: (session.user.user_metadata?.name as string) ?? null, email: session.user.email ?? null });
        loadRole();
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  async function signOut() {
    setOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.push('/');
    router.refresh();
  }

  // Loading placeholder (avoids a flash of "Sign In" before the session resolves).
  if (loading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-royal-100" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-royal-500 hover:text-royal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500"
      >
        Sign In
      </Link>
    );
  }

  const initials = initialsFrom(user.name, user.email);
  const displayName = user.name || user.email || 'Account';

  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { href: '/admin', label: 'Admin dashboard', icon: ShieldCheck, show: isAdmin },
    { href: '/referrals', label: 'Refer & earn', icon: Gift, show: true },
    { href: '/account/settings', label: 'Account settings', icon: Settings, show: true }
  ].filter((i) => i.show);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="group inline-flex items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500 focus-visible:ring-offset-2"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-royal-400 to-royal-600 text-sm font-semibold text-ink shadow-gold ring-2 ring-white">
          {initials}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-slate-500 transition group-hover:text-royal-700', open && 'rotate-180')} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-soft"
        >
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-royal-400 to-royal-600 text-xs font-semibold text-ink">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
              {user.email ? <p className="truncate text-xs text-slate-500">{user.email}</p> : null}
            </div>
          </div>

          <div className="my-1 h-px bg-slate-100" />

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-royal-50 hover:text-royal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500"
            >
              <item.icon className="h-4 w-4 text-royal-500" />
              {item.label}
            </Link>
          ))}

          <div className="my-1 h-px bg-slate-100" />

          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

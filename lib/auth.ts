import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/db';

export function getSupabaseServer() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — middleware will refresh sessions.
        }
      }
    }
  });
}

export async function getCurrentUser() {
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

/**
 * Server-side guard for admin-only routes. Fails closed: redirects to login when
 * unauthenticated, and to the homepage for any non-admin (or if the role lookup
 * fails). Call at the top of an admin layout/page Server Component.
 */
export async function requireAdmin() {
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/auth/login');
  }

  const dbUser = await prisma.user
    .findUnique({ where: { id: data.user.id }, select: { role: true } })
    .catch(() => null);

  if (dbUser?.role !== 'ADMIN') {
    redirect('/');
  }

  return data.user;
}

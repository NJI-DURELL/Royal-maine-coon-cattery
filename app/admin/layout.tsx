import { requireAdmin } from '@/lib/auth';

// Force dynamic so the auth/role check runs on every request (never cached).
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

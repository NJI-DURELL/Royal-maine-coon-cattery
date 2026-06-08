import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@royalmainecoon.test';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'AdminChangeMe123!';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Royal Maine Coon Admin';

async function provisionAdminAuth(): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    const fallbackId = '00000000-0000-0000-0000-000000000001';
    console.warn(
      'SUPABASE_SERVICE_ROLE_KEY not set — creating Prisma User only with deterministic id',
      fallbackId
    );
    console.warn(
      'You will not be able to log in until you also create a Supabase auth user with the same id.'
    );
    return fallbackId;
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: list, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw new Error(`Supabase listUsers failed: ${listError.message}`);

  const existing = list.users.find((u) => u.email === ADMIN_EMAIL);
  if (existing) {
    console.log(`Reusing Supabase auth user ${ADMIN_EMAIL} (${existing.id})`);
    return existing.id;
  }

  const { data: created, error } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true
  });
  if (error || !created?.user) {
    throw new Error(`Failed to create Supabase admin user: ${error?.message ?? 'unknown'}`);
  }
  console.log(`Created Supabase auth user ${ADMIN_EMAIL} (${created.user.id})`);
  return created.user.id;
}

async function seedAdmin() {
  const adminUserId = await provisionAdminAuth();

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: 'ADMIN', name: ADMIN_NAME },
    create: {
      id: adminUserId,
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      passwordHash: 'supabase-managed',
      role: 'ADMIN'
    }
  });

  console.log(`Admin user ready in Prisma: ${admin.email} (role=${admin.role}, id=${admin.id})`);
  console.log(`Login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

async function main() {
  await seedAdmin();
  // Kittens are created by the breeder through the admin dashboard (with uploaded images),
  // so no sample kittens are seeded here.
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

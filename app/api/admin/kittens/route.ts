import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { kittenSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const parsed = kittenSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 });
  }

  const { description, pedigree, healthTests, ...rest } = parsed.data;
  const kitten = await prisma.kitten.create({
    data: {
      ...rest,
      description: description || null,
      pedigree: pedigree || null,
      healthTests: healthTests || null
    }
  });

  return NextResponse.json({ kitten }, { status: 201 });
}

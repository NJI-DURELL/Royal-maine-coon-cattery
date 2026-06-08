import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const updateSchema = z.object({
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).optional(),
  price: z.coerce.number().min(0).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const kitten = await prisma.kitten
    .update({ where: { id: params.id }, data: parsed.data })
    .catch(() => null);

  if (!kitten) {
    return NextResponse.json({ error: 'Kitten not found' }, { status: 404 });
  }
  return NextResponse.json({ kitten });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const deleted = await prisma.kitten.delete({ where: { id: params.id } }).catch(() => null);
  if (!deleted) {
    return NextResponse.json({ error: 'Kitten not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

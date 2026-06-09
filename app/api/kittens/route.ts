import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Public list of selectable kittens for the application form.
export async function GET() {
  try {
    const kittens = await prisma.kitten.findMany({
      where: { status: { in: ['AVAILABLE', 'RESERVED'] } },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, name: true, color: true, gender: true, price: true, mainImageUrl: true, status: true }
    });
    return NextResponse.json({ kittens });
  } catch {
    return NextResponse.json({ kittens: [] });
  }
}

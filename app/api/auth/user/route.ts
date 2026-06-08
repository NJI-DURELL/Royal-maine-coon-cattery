import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: userData.user.id },
    include: { buyer: true }
  });

  return NextResponse.json({ user });
}

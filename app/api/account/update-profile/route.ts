import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, phone, location, country } = body;

  await prisma.user.update({
    where: { id: userData.user.id },
    data: { name, email, phone, location, country }
  });

  return NextResponse.json({ success: true });
}

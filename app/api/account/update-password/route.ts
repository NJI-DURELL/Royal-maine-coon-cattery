import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/auth';

export async function POST(request: Request) {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const { newPassword } = body;

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

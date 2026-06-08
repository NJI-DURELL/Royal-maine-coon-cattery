'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/lib/validation';
import type { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

type LoginForm = z.infer<typeof loginSchema>;
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginForm) {
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const response = await fetch('/api/auth/user');
    const data = await response.json();
    const user = data.user;

    if (user?.role === 'ADMIN') {
      router.push('/admin');
      return;
    }

    if (user?.buyer?.proofStatus === 'APPROVED') {
      router.push('/dashboard');
      return;
    }

    router.push('/verify-funds');
  }

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-3 text-slate-600">Access your verification dashboard, review kitten interests, and schedule your video adoption call.</p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          <p className="mt-1 text-xs text-red-600">{formState.errors.email?.message}</p>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          <p className="mt-1 text-xs text-red-600">{formState.errors.password?.message}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-royal-500 focus:ring-royal-500" />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="font-semibold text-royal-700 hover:text-royal-800">Forgot password?</Link>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Don’t have an account? <Link href="/auth/signup" className="font-semibold text-royal-700 hover:text-royal-800">Sign up</Link>
      </p>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signupSchema } from '@/lib/validation';
import type { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

type SignupForm = z.infer<typeof signupSchema>;
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupForm) {
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          data: {
            name: values.name,
            phone: values.phone,
            location: values.location,
            country: values.country
          }
        }
      });

      if (authError) {
        // Surfaced when the mail provider (custom SMTP) can't send the confirmation email.
        const friendly = /sending confirmation email/i.test(authError.message)
          ? "We couldn't send your confirmation email right now. Please try again shortly, or contact us if it keeps happening."
          : authError.message;
        setError(friendly);
        setLoading(false);
        return;
      }

      // A session means email confirmation is disabled — the user is already signed in.
      if (data.session) {
        router.push('/verify-funds');
        return;
      }

      // No session => Supabase sent a confirmation email. Tell the user to check it.
      setSentTo(values.email);
      setLoading(false);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-50 text-2xl">📬</div>
        <h1 className="mt-5 text-3xl font-semibold text-slate-900">Check your email</h1>
        <p className="mt-3 text-slate-600">
          We sent a confirmation link to <span className="font-semibold text-slate-900">{sentTo}</span>.
          Click it to activate your account, then sign in to continue your application.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Can&apos;t find it? Check your spam folder, or wait a minute and look again.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href="/auth/login" className="inline-flex rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-royal-600">
            Go to sign in
          </Link>
          <button
            onClick={() => { setSentTo(null); setError(null); }}
            className="text-sm font-semibold text-royal-700 hover:text-royal-800"
          >
            Use a different email
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
      <p className="mt-3 text-slate-600">Register and begin the buyer verification process for Royal Maine Coon kittens.</p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register('name')} />
          <p className="mt-1 text-xs text-red-600">{formState.errors.name?.message}</p>
        </div>
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
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          <p className="mt-1 text-xs text-red-600">{formState.errors.confirmPassword?.message}</p>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number (optional)</Label>
          <Input id="phone" {...register('phone')} />
        </div>
        <div>
          <Label htmlFor="location">Location (optional)</Label>
          <Input id="location" {...register('location')} />
        </div>
        <div>
          <Label htmlFor="country">Country (optional)</Label>
          <Input id="country" {...register('country')} />
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
          <input type="checkbox" {...register('agreeTerms')} className="h-4 w-4 rounded border-slate-300 text-royal-500 focus:ring-royal-500" />
          I agree to terms
        </label>
        <p className="mt-1 text-xs text-red-600">{formState.errors.agreeTerms?.message}</p>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link href="/auth/login" className="font-semibold text-royal-700 hover:text-royal-800">Log in</Link>
      </p>
    </section>
  );
}

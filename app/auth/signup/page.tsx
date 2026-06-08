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
  const { register, handleSubmit, formState } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupForm) {
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
          phone: values.phone,
          location: values.location,
          country: values.country
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push('/verify-funds');
      return;
    }

    router.push('/verify-funds');
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

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email')
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });

  async function onSubmit(values: ForgotForm) {
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your inbox for a password reset link.');
    }
    setLoading(false);
  }

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-slate-900">Forgot password</h1>
      <p className="mt-3 text-slate-600">Enter your account email and we’ll send a secure reset link.</p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          <p className="mt-1 text-xs text-red-600">{formState.errors.email?.message}</p>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

const resetSchema = z.object({
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<ResetForm>({ resolver: zodResolver(resetSchema) });

  async function onSubmit(values: ResetForm) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Your password has been updated. Please sign in again.');
    }
    setLoading(false);
  }

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-slate-900">Reset password</h1>
      <p className="mt-3 text-slate-600">Enter your new password. If you received a reset link, follow it and sign in after updating.</p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" {...register('password')} />
          <p className="mt-1 text-xs text-red-600">{formState.errors.password?.message}</p>
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          <p className="mt-1 text-xs text-red-600">{formState.errors.confirmPassword?.message}</p>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </section>
  );
}

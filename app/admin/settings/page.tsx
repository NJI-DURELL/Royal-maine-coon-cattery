'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function AdminSettingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({ defaultValues: { phone: '', email: '', address: '', hours: '', nannyFee: 0, pickupFee: 0, deliveryRegions: '' } });

  async function onSubmit(values: Record<string, string | number>) {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage('Platform settings saved successfully.');
    } catch (err) {
      setError('Unable to save settings.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Admin settings</h1>
        <p className="mt-3 text-slate-600">Update breeder contact information, delivery fees, and platform preferences.</p>
      </div>

      {message ? <Alert variant="success">{message}</Alert> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <form className="grid gap-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Breeder contact information</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="phone">Display phone number</Label>
              <Input id="phone" {...form.register('phone')} />
            </div>
            <div>
              <Label htmlFor="email">Display email</Label>
              <Input id="email" type="email" {...form.register('email')} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Display address</Label>
              <Textarea id="address" {...form.register('address')} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Delivery settings</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="nannyFee">Nanny delivery fee</Label>
              <Input id="nannyFee" type="number" {...form.register('nannyFee', { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="pickupFee">Pickup delivery fee</Label>
              <Input id="pickupFee" type="number" {...form.register('pickupFee', { valueAsNumber: true })} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="deliveryRegions">Delivery regions</Label>
              <Textarea id="deliveryRegions" {...form.register('deliveryRegions')} placeholder="List cities or regions separated by commas." />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Danger zone</h2>
          <p className="mt-3 text-slate-600">Delete admin account and reset the platform if needed.</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Button type="submit" disabled={loading}>Save settings</Button>
            <Button variant="danger">Delete admin account</Button>
          </div>
        </div>
      </form>
    </section>
  );
}

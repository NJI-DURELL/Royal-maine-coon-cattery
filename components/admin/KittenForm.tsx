'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { kittenSchema, type KittenInput } from '@/lib/validation';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

async function uploadKittenImage(file: File): Promise<string> {
  const res = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType: file.type, folder: 'kittens' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not get an upload URL');

  const put = await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
  if (!put.ok) throw new Error('Image upload failed');
  return data.publicUrl as string;
}

export function KittenForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<KittenInput>({
    resolver: zodResolver(kittenSchema),
    defaultValues: { status: 'AVAILABLE', gender: 'Female', galleryImages: [] }
  });

  const mainImageUrl = watch('mainImageUrl');

  async function onMainImage(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadKittenImage(file);
      setValue('mainImageUrl', url, { shouldValidate: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: KittenInput) {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/kittens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create kitten');
      router.push('/admin/kittens');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error ? <Alert variant="danger">{error}</Alert> : null}

      {/* Main image */}
      <div>
        <Label htmlFor="mainImage">Main photo *</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {mainImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImageUrl} alt="Kitten preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
            )}
          </div>
          <input
            id="mainImage"
            type="file"
            accept="image/*"
            onChange={(e) => onMainImage(e.target.files?.[0])}
            className="text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-royal-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-royal-600"
          />
        </div>
        {uploading ? <p className="mt-1 text-xs text-slate-500">Uploading…</p> : null}
        {errors.mainImageUrl ? <p className="mt-1 text-xs text-red-600">{errors.mainImageUrl.message}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register('name')} />
          <p className="mt-1 text-xs text-red-600">{errors.name?.message}</p>
        </div>
        <div>
          <Label htmlFor="color">Color *</Label>
          <Input id="color" placeholder="e.g. Silver tabby" {...register('color')} />
          <p className="mt-1 text-xs text-red-600">{errors.color?.message}</p>
        </div>
        <div>
          <Label htmlFor="ageWeeks">Age (weeks) *</Label>
          <Input id="ageWeeks" type="number" {...register('ageWeeks')} />
          <p className="mt-1 text-xs text-red-600">{errors.ageWeeks?.message}</p>
        </div>
        <div>
          <Label htmlFor="price">Price (USD) *</Label>
          <Input id="price" type="number" step="1" {...register('price')} />
          <p className="mt-1 text-xs text-red-600">{errors.price?.message}</p>
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <select
            id="gender"
            {...register('gender')}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            {...register('status')}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
          >
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="healthTests">Health tests</Label>
          <Textarea id="healthTests" rows={2} placeholder="Vaccinated, microchipped, HCM/SMA screened…" {...register('healthTests')} />
        </div>
        <div>
          <Label htmlFor="pedigree">Pedigree</Label>
          <Textarea id="pedigree" rows={2} placeholder="Bloodline / pedigree notes" {...register('pedigree')} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? 'Saving…' : 'Add kitten'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/admin/kittens')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyFundsSchema } from '@/lib/validation';
import { type z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

type VerifyFundsForm = z.infer<typeof verifyFundsSchema>;

export default function VerifyFundsPage() {
  return (
    <Suspense fallback={null}>
      <VerifyFundsForm />
    </Suspense>
  );
}

function VerifyFundsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedKitten = searchParams.get('kitten');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  const form = useForm<VerifyFundsForm>({
    resolver: zodResolver(verifyFundsSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      country: '',
      kittenIds: preselectedKitten ? [preselectedKitten] : [],
      proofDescription: '',
      proofAmount: 500,
      transportationPlan: 'NANNY',
      deliveryLocation: '',
      hasVet: false,
      monthlyBudget: 100,
      housingSituation: '',
      familyApproval: false,
      agreementVideoCall: false,
      agreementDeposit: false,
      agreementTerms: false
    }
  });

  async function handleUpload(file: File) {
    const response = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to get upload URL');
    }
    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });
    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }
    return `https://${data.bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}.amazonaws.com/${data.key}`;
  }

  async function onSubmit(values: VerifyFundsForm) {
    setUploadError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      let url = proofUrl;
      if (proofFile) {
        url = await handleUpload(proofFile);
      }
      const response = await fetch('/api/verify-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, proofUrl: url })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit verification');
      }
      setSuccessMessage('Proof submitted! We\'ll review within 24 hours.');
      router.push('/thank-you');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Step 1 of adoption</p>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Apply to adopt</h1>
        <p className="max-w-3xl text-slate-600">
          A few quick details so we can confirm you&apos;re ready, reserve your kitten, and book your private video
          call. Takes about 3 minutes — your information stays private.
        </p>
      </div>

      {/* What you'll need */}
      <div className="rounded-[1.5rem] border border-royal-200 bg-royal-50/60 p-6">
        <h2 className="text-base font-semibold text-slate-900">What you&apos;ll need</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <li className="flex gap-2"><span className="text-royal-600">✓</span> A proof-of-funds file — bank statement, screenshot, or money-order photo</li>
          <li className="flex gap-2"><span className="text-royal-600">✓</span> At least <strong>&nbsp;$500</strong>&nbsp;available for the kitten + first-year care</li>
          <li className="flex gap-2"><span className="text-royal-600">✓</span> Your contact details and delivery city</li>
          <li className="flex gap-2"><span className="text-royal-600">✓</span> A few quick agreements at the end</li>
        </ul>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {uploadError ? <Alert variant="danger">{uploadError}</Alert> : null}
        {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Buyer Information</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...form.register('fullName')} />
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.fullName?.message}</p>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...form.register('email')} />
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.email?.message}</p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" {...form.register('phone')} />
              <p className="mt-1 text-xs text-slate-500">Include your country code.</p>
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone?.message}</p>
            </div>
            <div>
              <Label htmlFor="location">Location / City</Label>
              <Input id="location" {...form.register('location')} />
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.location?.message}</p>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...form.register('country')} />
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.country?.message}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Kitten Interest</h2>
          <div className="mt-6 grid gap-6">
            <div>
              <Label htmlFor="kittenIds">Which kitten(s) are you interested in?</Label>
              <select id="kittenIds" multiple className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100" {...form.register('kittenIds')}>
                {preselectedKitten ? <option value={preselectedKitten}>Selected kitten</option> : <option value="standard">General kitten interest</option>}
              </select>
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.kittenIds?.message}</p>
            </div>
            <div>
              <Label htmlFor="proofDescription">Funding note (optional)</Label>
              <Textarea id="proofDescription" {...form.register('proofDescription')} placeholder="Only if you're not uploading a file — briefly describe your funding source." />
              <p className="mt-1 text-xs text-slate-500">Optional. A note can&apos;t replace the document if a file is required.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Proof of Funds</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="proofFile">Upload Proof of Funds</Label>
              <input
                id="proofFile"
                type="file"
                title="Upload proof of funds"
                accept="application/pdf,image/jpeg,image/png"
                onChange={(event) => setProofFile(event.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              />
              <p className="mt-2 text-xs text-slate-600">Acceptable: bank statement, screenshot, money order photo. Max 10MB.</p>
            </div>
            <div>
              <Label htmlFor="proofAmount">Total amount available for kitten + care (USD)</Label>
              <Input id="proofAmount" type="number" min={500} step="50" placeholder="e.g. 2500" {...form.register('proofAmount', { valueAsNumber: true })} />
              <p className="mt-1 text-xs text-slate-500">Minimum $500 — the price of the kitten plus first-year care.</p>
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.proofAmount?.message}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Transportation Plan</h2>
          <div className="mt-6 grid gap-6">
            <div>
              <Label htmlFor="transportationPlan">How will you get the kitten?</Label>
              <select
                id="transportationPlan"
                title="Choose a transportation plan"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                {...form.register('transportationPlan')}
              >
                <option value="NANNY">Nanny Delivery (1-2 days from breeder)</option>
                <option value="PICKUP">Pickup Delivery (breeder brings to designated location)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="deliveryLocation">Your city/location for delivery planning</Label>
              <Input id="deliveryLocation" {...form.register('deliveryLocation')} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Post-Adoption Care Plan</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                <input type="checkbox" {...form.register('hasVet')} className="h-4 w-4 rounded border-slate-300 text-royal-500 focus:ring-royal-500" />
                I have a veterinarian lined up for checkups
              </label>
              <p className="text-xs text-slate-600">Veterinary support is required for long-term kitten health.</p>
            </div>
            <div>
              <Label htmlFor="monthlyBudget">Monthly budget for food/healthcare (USD)</Label>
              <Input id="monthlyBudget" type="number" min={50} step="10" placeholder="e.g. 100" {...form.register('monthlyBudget', { valueAsNumber: true })} />
              <p className="mt-1 text-xs text-slate-500">At least $50 per month.</p>
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.monthlyBudget?.message}</p>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="housingSituation">Describe your housing situation</Label>
              <Textarea id="housingSituation" {...form.register('housingSituation')} placeholder="e.g. We live in a 2-bedroom house with a fenced yard. The kitten will be indoors, and we have one other cat." />
              <p className="mt-1 text-xs text-slate-500">At least 20 characters — tell us about your home, whether it&apos;s indoor/outdoor, and any other pets.</p>
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.housingSituation?.message}</p>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                <input type="checkbox" {...form.register('familyApproval')} className="h-4 w-4 rounded border-slate-300 text-royal-500 focus:ring-royal-500" />
                All family members/household agree to this adoption
              </label>
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.familyApproval?.message}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Agreement & Submit</h2>
          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
              <input type="checkbox" {...form.register('agreementVideoCall')} className="h-4 w-4 rounded border-slate-300 text-royal-500 focus:ring-royal-500" />
              I understand I must complete a video call before purchase
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
              <input type="checkbox" {...form.register('agreementDeposit')} className="h-4 w-4 rounded border-slate-300 text-royal-500 focus:ring-royal-500" />
              I understand deposits are required to reserve a kitten
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
              <input type="checkbox" {...form.register('agreementTerms')} className="h-4 w-4 rounded border-slate-300 text-royal-500 focus:ring-royal-500" />
              I agree to the terms and conditions
            </label>
          </div>
          <Button type="submit" disabled={isSaving} className="mt-6 w-full">
            {isSaving ? 'Uploading proof... Please wait' : 'Submit Proof for Verification'}
          </Button>
        </div>
      </form>
    </section>
  );
}

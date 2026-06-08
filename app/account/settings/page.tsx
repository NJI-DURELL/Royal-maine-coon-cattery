'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AccountSettingsPage() {
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const profileForm = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const handleProfile: SubmitHandler<ProfileFormData> = async (values) => {
    setSaving(true);
    setError(null);
    setProfileMessage(null);

    const res = await fetch('/api/account/update-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to update profile');
    } else {
      setProfileMessage('Profile updated successfully');
    }
    setSaving(false);
  };

  const handlePassword: SubmitHandler<PasswordFormData> = async (values) => {
    setSaving(true);
    setError(null);
    setPasswordMessage(null);

    const res = await fetch('/api/account/update-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to update password');
    } else {
      setPasswordMessage('Password updated successfully');
    }
    setSaving(false);
  };

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Account settings</h1>
        <p className="mt-3 text-slate-600">Update your profile, manage security, and keep your account information current.</p>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {profileMessage ? <Alert variant="success">{profileMessage}</Alert> : null}
      {passwordMessage ? <Alert variant="success">{passwordMessage}</Alert> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Profile information</h2>
          <form className="mt-6 space-y-6" onSubmit={profileForm.handleSubmit(handleProfile)}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...profileForm.register('name')} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...profileForm.register('email')} />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" {...profileForm.register('phone')} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...profileForm.register('location')} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...profileForm.register('country')} />
            </div>
            <Button type="submit" disabled={saving}>Save profile</Button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Password change</h2>
            <form className="mt-6 space-y-6" onSubmit={passwordForm.handleSubmit(handlePassword)}>
              <div>
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" {...passwordForm.register('currentPassword')} />
              </div>
              <div>
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" {...passwordForm.register('newPassword')} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" {...passwordForm.register('confirmPassword')} />
              </div>
              <Button type="submit" disabled={saving}>Update password</Button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Account security</h2>
            <p className="mt-4 text-slate-600">Active sessions and security controls will appear here once you sign in with a verified account.</p>
            <Button variant="secondary" className="mt-4">Sign out all other sessions</Button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Delete account</h2>
            <p className="mt-4 text-slate-600">If you want to remove your account, we can permanently delete your profile and buyer data.</p>
            <Button variant="danger">Delete my account</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function VerificationActions({ buyerId }: { buyerId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | 'APPROVE' | 'REJECT'>(null);

  async function act(action: 'APPROVE' | 'REJECT') {
    let reason: string | undefined;
    if (action === 'REJECT') {
      reason = prompt('Reason for rejection (optional):') ?? undefined;
    } else if (!confirm('Approve this buyer? They will be able to schedule a video call.')) {
      return;
    }

    setBusy(action);
    const res = await fetch(`/api/admin/verifications/${buyerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Action failed');
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" disabled={busy !== null} onClick={() => act('APPROVE')}>
        {busy === 'APPROVE' ? 'Approving…' : 'Approve'}
      </Button>
      <Button variant="danger" disabled={busy !== null} onClick={() => act('REJECT')}>
        {busy === 'REJECT' ? 'Rejecting…' : 'Reject'}
      </Button>
    </div>
  );
}

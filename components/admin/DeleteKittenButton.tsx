'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteKittenButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/kittens/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Could not delete kitten');
      setBusy(false);
    }
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
    >
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  );
}

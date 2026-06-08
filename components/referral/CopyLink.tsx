'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';

export function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the input remains selectable as a fallback.
    }
  };

  const share = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Royal Maine Coon Cattery',
          text: 'Adopt a health-tested, purebred Maine Coon kitten — use my link:',
          url: link
        });
      } catch {
        // user cancelled the share sheet
      }
    } else {
      copy();
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700 focus:border-royal-500 focus:outline-none"
        aria-label="Your referral link"
      />
      <button
        onClick={copy}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-royal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-royal-600"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <button
        onClick={share}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-royal-500 hover:text-royal-700"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}

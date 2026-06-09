import { siteConfig } from '@/lib/seo';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** Shape of a proof-of-funds submission we notify the breeder about. */
export type BuyerSubmission = {
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  country?: string | null;
  proofAmount?: number | null;
  kittenIds?: string[] | null;
  proofUrl?: string | null;
  proofDescription?: string | null;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const row = (label: string, value: string) =>
  `<tr>
    <td style="padding:8px 0; font-size:13px; color:#94a3b8; width:180px; vertical-align:top; font-family:Helvetica,Arial,sans-serif;">${label}</td>
    <td style="padding:8px 0; font-size:14px; color:#0f172a; font-weight:600; font-family:Helvetica,Arial,sans-serif;">${value}</td>
  </tr>`;

function buildHtml(data: BuyerSubmission) {
  const kittens = data.kittenIds?.length ? data.kittenIds.join(', ') : 'General interest';
  const proof = data.proofUrl
    ? `<a href="${escapeHtml(data.proofUrl)}" style="color:#8d7024; text-decoration:underline;">View uploaded document</a>`
    : escapeHtml(data.proofDescription || 'No file uploaded');

  return `<!DOCTYPE html>
<html lang="en"><body style="margin:0; padding:0; background-color:#fdf7e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdf7e8;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #efd0a9; border-radius:24px; overflow:hidden; box-shadow:0 20px 50px rgba(15,23,42,0.12);">
        <tr><td style="background-color:#d4af37; background-image:linear-gradient(135deg,#d4af37 0%,#b88f2c 100%); padding:28px 36px;">
          <span style="color:#ffffff; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; font-family:Helvetica,Arial,sans-serif;">New verification request</span>
          <div style="color:#ffffff; font-size:22px; font-weight:700; margin-top:6px; font-family:Helvetica,Arial,sans-serif;">Proof of funds submitted</div>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <p style="margin:0 0 20px 0; font-size:15px; line-height:1.6; color:#334155; font-family:Helvetica,Arial,sans-serif;">
            <strong style="color:#0f172a;">${escapeHtml(data.fullName)}</strong> just submitted proof of funds for review.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #f1e7d2;">
            ${row('Email', escapeHtml(data.email))}
            ${row('Phone', escapeHtml(data.phone || '—'))}
            ${row('Location', escapeHtml([data.location, data.country].filter(Boolean).join(', ') || '—'))}
            ${row('Amount available', data.proofAmount != null ? `$${escapeHtml(String(data.proofAmount))}` : '—')}
            ${row('Interested kittens', escapeHtml(kittens))}
            ${row('Proof', proof)}
          </table>
        </td></tr>
        <tr><td style="padding:0 36px 28px 36px;">
          <p style="margin:0; font-size:12px; color:#b0b8c4; font-family:Helvetica,Arial,sans-serif;">© ${siteConfig.name}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * Notify the breeder that a buyer submitted proof of funds.
 * Uses the Resend REST API directly (no SDK dependency). Best-effort: returns
 * false instead of throwing when email is unconfigured or the send fails, so a
 * submission is never blocked on the notification.
 */
export async function sendBreederNotification(data: BuyerSubmission): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.BREEDER_EMAIL;

  if (!apiKey || !from || !to) {
    // Email not configured — skip silently.
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `New proof of funds — ${data.fullName}`,
        html: buildHtml(data)
      })
    });

    if (!response.ok) {
      console.error('Resend notification failed:', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Resend notification error:', error);
    return false;
  }
}

function buildRejectionHtml(name: string | null | undefined, reason: string) {
  const greeting = name ? escapeHtml(name.split(' ')[0]) : 'there';
  return `<!DOCTYPE html>
<html lang="en"><body style="margin:0; padding:0; background-color:#fdf7e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdf7e8;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #efd0a9; border-radius:24px; overflow:hidden; box-shadow:0 20px 50px rgba(15,23,42,0.12);">
        <tr><td style="background-color:#0f172a; background-image:linear-gradient(135deg,#1c1813 0%,#0f172a 100%); padding:28px 36px;">
          <span style="color:#d4af37; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; font-family:Helvetica,Arial,sans-serif;">${escapeHtml(siteConfig.name)}</span>
          <div style="color:#ffffff; font-size:22px; font-weight:700; margin-top:6px; font-family:Helvetica,Arial,sans-serif;">An update on your application</div>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#334155; font-family:Helvetica,Arial,sans-serif;">Hi ${greeting},</p>
          <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#334155; font-family:Helvetica,Arial,sans-serif;">
            Thank you for applying to adopt with us. We reviewed your proof of funds and weren't able to approve it at this time.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px 0;">
            <tr><td style="border-left:3px solid #d4af37; background:#fdf6eb; padding:14px 18px; border-radius:0 10px 10px 0;">
              <p style="margin:0; font-size:12px; color:#8d7024; font-weight:700; text-transform:uppercase; letter-spacing:1px; font-family:Helvetica,Arial,sans-serif;">Reason</p>
              <p style="margin:6px 0 0 0; font-size:15px; color:#0f172a; line-height:1.6; font-family:Helvetica,Arial,sans-serif;">${escapeHtml(reason)}</p>
            </td></tr>
          </table>
          <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#334155; font-family:Helvetica,Arial,sans-serif;">
            You're welcome to submit updated proof — we'd love to help you find your kitten.
          </p>
          <a href="${siteConfig.url}/verify-funds" style="display:inline-block; background:#d4af37; color:#12100c; font-weight:700; text-decoration:none; padding:12px 24px; border-radius:9999px; font-size:14px; font-family:Helvetica,Arial,sans-serif;">Submit new proof</a>
        </td></tr>
        <tr><td style="padding:0 36px 28px 36px;">
          <p style="margin:0; font-size:12px; color:#b0b8c4; font-family:Helvetica,Arial,sans-serif;">Questions? Reply to this email. © ${escapeHtml(siteConfig.name)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * Email a buyer that their proof-of-funds was rejected, with the reason and a
 * link to re-submit. Best-effort: returns false (never throws) when email is
 * unconfigured or the send fails, so rejection is never blocked on the email.
 */
export async function sendRejectionEmail(params: {
  to: string;
  name?: string | null;
  reason: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from || !params.to) return false;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: `Update on your ${siteConfig.name} application`,
        html: buildRejectionHtml(params.name, params.reason)
      })
    });

    if (!response.ok) {
      console.error('Rejection email failed:', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Rejection email error:', error);
    return false;
  }
}

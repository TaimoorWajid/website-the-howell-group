/**
 * The Howell Group — job-application emails (Express/Node, TypeScript).
 *
 * Called by the apply router (src/server/careers-api.ts) AFTER the disk
 * archive succeeds. Every application is archived on disk AND emailed;
 * a mail failure never breaks the archive or the HTTP response
 * (the caller wraps this in try/catch).
 *
 * Verified against the actual payload shape:
 *   req.body = { requestId, jobId, firstName, lastName, email, phone,
 *                location, profile, introduction, consent, website,
 *                resume: { name, data } }   // resume is NESTED, base64
 *
 * No SDK needed: Resend is called with plain fetch, exactly like the
 * Cloudflare Worker does. Requires only the RESEND_API_KEY env var
 * (same key as the Worker).
 */
const RESEND_API = 'https://api.resend.com/emails';

/* --------------------------------- CONFIG --------------------------------- */
const TO_EMAIL = 'info@thehowellgroup.co'; // confirmed by the user 2026-10-21
const CC_EMAILS: string[] = ['syedtaimoor26@gmail.com']; // testing CC — remove after testing
const FROM_EMAIL = 'The Howell Group Website <forms@thehowellgroup.co>'; // domain must be verified in Resend
const COMPANY = {
  name: 'The Howell Group',
  email: 'info@thehowellgroup.co',
  site: 'https://thehowellgroup.co',
} as const;

export interface ApplicationMailMeta {
  jobTitle?: string;
  reference?: string;
}

function label(key: string): string {
  const s = key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Minimal Resend send via the REST API (no SDK). Throws on failure. */
async function resendSend(payload: Record<string, unknown>): Promise<void> {
  const key = process.env['RESEND_API_KEY'];
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

/**
 * Sends the notification (to the company inbox, Reply-To = applicant,
 * resume attached) + the confirmation to the applicant.
 * Throws on Resend failure — the caller must catch.
 */
export async function emailApplication(
  body: Record<string, unknown>,
  meta: ApplicationMailMeta = {},
): Promise<void> {
  const fields = body ?? {};
  const jobTitle = meta.jobTitle ?? '';
  const reference = meta.reference ?? '';

  const firstName = String(fields['firstName'] ?? '').trim();
  const lastName = String(fields['lastName'] ?? '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Website applicant';
  const email = String(fields['email'] ?? '').trim();

  // Resume is nested: { name, data } where data is a base64 string.
  const resume =
    fields['resume'] && typeof fields['resume'] === 'object'
      ? (fields['resume'] as Record<string, unknown>)
      : null;
  const resumeName = resume && typeof resume['name'] === 'string' ? resume['name'] : null;
  const resumeB64 =
    resume && typeof resume['data'] === 'string'
      ? resume['data'].replace(/^data:[^;]+;base64,/, '')
      : null;
  const attachments = resumeB64 ? [{ filename: resumeName || 'resume.pdf', content: resumeB64 }] : [];

  const stamp = new Date().toUTCString();
  const skip = new Set(['resume', 'website', 'consent', 'requestId']);
  const rows = Object.entries(fields).filter(
    ([k, v]) =>
      !skip.has(k) &&
      v !== undefined &&
      v !== null &&
      typeof v !== 'object' &&
      String(v).trim() !== '' &&
      String(v).length < 4000,
  );
  const detailLines = rows.map(([k, v]) => `${label(k)}: ${String(v)}`).join('\n');

  // A) Notification to the company inbox (Reply-To = applicant).
  await resendSend({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    ...(CC_EMAILS.length ? { cc: CC_EMAILS } : {}),
    subject: `[Application] ${jobTitle || 'Position'} — ${fullName}${reference ? ` (${reference})` : ''}`,
    text:
      `New Job Application — ${COMPANY.site}\nSubmitted: ${stamp}\n` +
      (reference ? `Reference: ${reference}\n` : '') +
      (jobTitle ? `Position: ${jobTitle}\n` : '') +
      `${'='.repeat(60)}\n\n` +
      detailLines +
      (resumeName ? `\nResume attached: ${resumeName}\n` : '') +
      `\n${'-'.repeat(60)}\nTip: reply to this email to respond to the applicant directly.\n`,
    ...(email ? { reply_to: email } : {}),
    ...(attachments.length ? { attachments } : {}),
  });

  // B) Confirmation to the applicant.
  if (email) {
    await resendSend({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Application received — The Howell Group',
      text:
        `Application received — ${COMPANY.name}\n\n` +
        `${firstName ? `Hi ${firstName},` : 'Hello,'}\n\n` +
        `Thank you for applying${jobTitle ? ` for the ${jobTitle} position` : ''} at ${COMPANY.name}. ` +
        `We have received your application${reference ? ` (reference ${reference})` : ''} and our team will review it carefully.\n\n` +
        `If your experience aligns with what we are looking for, we will reach out to schedule a conversation.\n\n` +
        `— ${COMPANY.name}\n${COMPANY.email} · ${COMPANY.site}\n`,
    });
  }
}

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
 *
 * Templates are the same enterprise HTML design as the Worker's contact
 * emails (table layout, inline styles, no external images, preheader +
 * plain-text fallback) so every email from the site looks consistent.
 */
const RESEND_API = 'https://api.resend.com/emails';

/* --------------------------------- CONFIG --------------------------------- */
const TO_EMAIL = 'info@thehowellgroup.co'; // confirmed by the user 2026-10-21
const CC_EMAILS: string[] = ['syedtaimoor26@gmail.com']; // testing CC — remove after testing
const FROM_EMAIL = 'The Howell Group Website <forms@thehowellgroup.co>'; // domain must be verified in Resend
const BRAND = {
  ink: '#061F1F',
  accent: '#0B7890',
  paper: '#F3F4F0',
  text: '#1F2A28',
  muted: '#66716F',
  line: '#E2E5E0',
} as const;
const COMPANY = {
  name: 'The Howell Group',
  email: 'info@thehowellgroup.co',
  site: 'https://thehowellgroup.co',
} as const;

export interface ApplicationMailMeta {
  jobTitle?: string;
  reference?: string;
}

interface BuiltMail {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string }>;
}

/* ------------------------------ template helpers --------------------------- */
/* Ported from the Cloudflare Worker so site emails share one visual design. */

function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailShell(opts: {
  preheader: string;
  eyebrow: string;
  heading: string;
  bodyHtml: string;
}): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${BRAND.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${BRAND.line};border-radius:10px;overflow:hidden;">
<tr><td style="background:${BRAND.ink};padding:30px 34px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:bold;letter-spacing:0.22em;color:#ffffff;">THE HOWELL <span style="color:${BRAND.accent};">GROUP</span></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;color:#9fb3b0;margin-top:8px;">WE DELIVER YOUR MISSION</div>
</td></tr>
<tr><td style="height:4px;background:${BRAND.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:30px 34px 34px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.accent};margin:0 0 10px;">${esc(opts.eyebrow)}</div>
<h1 style="font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.3;color:${BRAND.text};margin:0 0 6px;">${esc(opts.heading)}</h1>
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:20px 34px;border-top:1px solid ${BRAND.line};">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:${BRAND.muted};margin:0;">${esc(COMPANY.name)} &middot; ${esc(COMPANY.email)} &middot; ${esc(COMPANY.site)}</div>
</td></tr>
</table>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${BRAND.muted};margin-top:14px;">This email was sent from the ${esc(COMPANY.name)} website.</div>
</td></tr>
</table>
</body></html>`;
}

function detailsTable(rows: Array<[string, string]>, resumeName: string | null): string {
  const trs = rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:10px 14px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND.muted};vertical-align:top;width:150px;border-bottom:1px solid ${BRAND.line};">${esc(k)}</td>
        <td style="padding:10px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.text};vertical-align:top;border-bottom:1px solid ${BRAND.line};white-space:pre-wrap;">${esc(v)}</td>
      </tr>`,
    )
    .join('');
  const resumeRow = resumeName
    ? `<tr>
        <td style="padding:10px 14px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND.muted};vertical-align:top;">Resume</td>
        <td style="padding:10px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.text};vertical-align:top;">Attached &mdash; ${esc(resumeName)}</td>
      </tr>`
    : '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">${trs}${resumeRow}</table>`;
}

function paragraph(html: string): string {
  return `<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${BRAND.text};margin:10px 0;">${html}</p>`;
}

/* ------------------------------- mail builders ----------------------------- */

function fullNameOf(fields: Record<string, unknown>): string {
  const first = String(fields['firstName'] ?? '').trim();
  const last = String(fields['lastName'] ?? '').trim();
  return [first, last].filter(Boolean).join(' ') || 'Website applicant';
}

function resumeOf(fields: Record<string, unknown>): {
  name: string | null;
  b64: string | null;
} {
  const resume =
    fields['resume'] && typeof fields['resume'] === 'object'
      ? (fields['resume'] as Record<string, unknown>)
      : null;
  const name =
    resume && typeof resume['name'] === 'string' ? resume['name'] : null;
  const b64 =
    resume && typeof resume['data'] === 'string'
      ? resume['data'].replace(/^data:[^;]+;base64,/, '')
      : null;
  return { name, b64 };
}

/** Notification to the company inbox (Reply-To = applicant, resume attached). */
export function buildApplicationNotification(
  fields: Record<string, unknown>,
  meta: ApplicationMailMeta,
  stamp: string,
): BuiltMail {
  const jobTitle = meta.jobTitle ?? '';
  const reference = meta.reference ?? '';
  const fullName = fullNameOf(fields);
  const email = String(fields['email'] ?? '').trim();
  const { name: resumeName, b64: resumeB64 } = resumeOf(fields);

  const rows: Array<[string, string]> = [
    ['Position', jobTitle || '—'],
    ...(reference ? [['Reference', reference] as [string, string]] : []),
    ['Name', fullName],
    ['Email', email || '—'],
    ['Phone', String(fields['phone'] ?? '').trim() || '—'],
    ['Location', String(fields['location'] ?? '').trim() || '—'],
    ['Profile', String(fields['profile'] ?? '').trim() || '—'],
    ['Introduction', String(fields['introduction'] ?? '').trim() || '—'],
  ];

  const subject = `[Application] ${jobTitle || 'Position'} — ${fullName}${reference ? ` (${reference})` : ''}`;
  const text =
    `New Job Application — ${COMPANY.site}\nSubmitted: ${stamp}\n${'='.repeat(60)}\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    (resumeName ? `\nResume attached: ${resumeName}\n` : '') +
    `\n${'-'.repeat(60)}\nTip: reply to this email to respond to the applicant directly.\n`;

  const html = emailShell({
    preheader: `New job application from ${fullName}${jobTitle ? ` for ${jobTitle}` : ''}`,
    eyebrow: 'New Job Application',
    heading: 'Application received via website',
    bodyHtml:
      paragraph(
        `Submitted <strong>${esc(stamp)}</strong>${reference ? ` &middot; Reference <strong>${esc(reference)}</strong>` : ''}. Full details below &mdash; reply to this email to respond to the applicant directly.`,
      ) + detailsTable(rows, resumeName),
  });

  return {
    subject,
    text,
    html,
    ...(email ? { replyTo: email } : {}),
    ...(resumeB64
      ? { attachments: [{ filename: resumeName || 'resume.pdf', content: resumeB64 }] }
      : {}),
  };
}

/** Confirmation to the applicant. */
export function buildApplicationAutoReply(
  fields: Record<string, unknown>,
  meta: ApplicationMailMeta,
): BuiltMail {
  const jobTitle = meta.jobTitle ?? '';
  const reference = meta.reference ?? '';
  const firstName = String(fields['firstName'] ?? '').trim();
  const greeting = firstName ? `Hi ${esc(firstName)},` : 'Hello,';
  const intro =
    `Thank you for applying${jobTitle ? ` for the <strong>${esc(jobTitle)}</strong> position` : ''} at ${esc(COMPANY.name)}. ` +
    `We have received your application${reference ? ` (reference <strong>${esc(reference)}</strong>)` : ''} and our team will review it carefully.`;
  const next =
    'If your experience aligns with what we are looking for, we will reach out to schedule a conversation. Thank you for your interest in joining our team.';

  const stripTags = (s: string): string => s.replace(/<[^>]+>/g, '');
  const subject = 'Application received — The Howell Group';
  const text =
    `Application received — ${COMPANY.name}\n\n${stripTags(greeting)}\n\n${stripTags(intro)}\n\n${stripTags(next)}\n\n— ${COMPANY.name}\n${COMPANY.email} · ${COMPANY.site}\n`;
  const html = emailShell({
    preheader: 'Your application has been received',
    eyebrow: 'Confirmation',
    heading: 'Application received',
    bodyHtml: paragraph(greeting) + paragraph(intro) + paragraph(next),
  });

  return { subject, text, html };
}

/* --------------------------------- sending --------------------------------- */

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
  const stamp = new Date().toUTCString();
  const email = String(fields['email'] ?? '').trim();

  const notification = buildApplicationNotification(fields, meta, stamp);
  await resendSend({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    ...(CC_EMAILS.length ? { cc: CC_EMAILS } : {}),
    subject: notification.subject,
    text: notification.text,
    html: notification.html,
    ...(notification.replyTo ? { reply_to: notification.replyTo } : {}),
    ...(notification.attachments ? { attachments: notification.attachments } : {}),
  });

  if (email) {
    const reply = buildApplicationAutoReply(fields, meta);
    await resendSend({
      from: FROM_EMAIL,
      to: [email],
      subject: reply.subject,
      text: reply.text,
      html: reply.html,
    });
  }
}

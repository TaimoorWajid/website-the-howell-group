import express from 'express';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { PREVIEW_JOBS } from '../app/core/data/careers-preview.data';
import { ApplicationReceipt, CareersCatalog, Job, JobApplication, MAX_RESUME_BYTES } from '../app/core/models/careers.models';

interface Options { mode?: string; jobsFile?: string; storageDir?: string; publicOrigin?: string; }
export function createCareersRouter(options: Options = {}) {
  const router = express.Router();
  const mode = options.mode ?? process.env['CAREERS_MODE'] ?? 'preview';
  const jobsFile = options.jobsFile ?? process.env['CAREERS_JOBS_FILE'];
  const storageDir = options.storageDir ?? process.env['CAREERS_STORAGE_DIR'];
  const publicOrigin = options.publicOrigin ?? process.env['CAREERS_PUBLIC_ORIGIN'];
  const directory = resolve(storageDir ?? '.data/careers-preview');
  // Applicant records must never be served as public assets.
  const publicPaths = ['public', 'dist', 'src'].map(path => resolve(path));
  const unsafeStorage = publicPaths.some(path => directory === path || directory.startsWith(path + '/') || directory.startsWith(path + '\\'));
  const inFlight = new Map<string, Promise<ApplicationReceipt>>();
  const attempts = new Map<string, { count: number; expires: number }>();
  const catalog = async (): Promise<CareersCatalog> => {
    if (mode !== 'live' && mode !== 'preview') throw new Error('Invalid careers mode');
    if (unsafeStorage || (mode === 'live' && (!jobsFile || !storageDir || !isAbsolute(storageDir)))) throw new Error('Careers configuration is incomplete');
    const jobs: unknown = mode === 'preview' ? PREVIEW_JOBS : JSON.parse(await readFile(jobsFile!, 'utf8'));
    if (!Array.isArray(jobs) || !jobs.every(validJob) || new Set(jobs.map(job => job.id)).size !== jobs.length || new Set(jobs.map(job => job.slug)).size !== jobs.length) throw new Error('Invalid careers catalog');
    return { mode, jobs: jobs.filter(job => !job.closingDate || Date.parse(job.closingDate + 'T23:59:59Z') >= Date.now()) };
  };
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/', async (_req, res) => {
    try { res.json(await catalog()); }
    catch { res.status(503).json({ message: 'Opportunities are temporarily unavailable. Please try again shortly.' }); }
  });
  router.post('/applications', (req, res, next) => {
    const origin = req.get('origin');
    if (origin && origin !== (publicOrigin ?? `${req.protocol}://${req.get('host')}`)) { res.status(403).json({ message: 'Please submit your application from this website.' }); return; }
    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires < now) attempts.delete(key);
    const key = req.ip ?? 'unknown';
    const attempt = attempts.get(key) ?? { count: 0, expires: now + 15 * 60_000 };
    if (++attempt.count > 20) { res.set('Retry-After', String(Math.ceil((attempt.expires - now) / 1000))); res.status(429).json({ message: 'Too many attempts. Please wait 15 minutes before trying again.' }); return; }
    attempts.set(key, attempt); next();
  }, express.json({ limit: '8mb' }), async (req, res) => {
    const body = req.body;
    const error = validateApplication(body);
    if (error) { res.status(400).json({ message: error }); return; }
    try {
      const data = await catalog();
      const job = data.jobs.find(item => item.id === body.jobId);
      if (!job) { res.status(410).json({ message: 'This position is no longer accepting applications. Please explore our other opportunities.' }); return; }
      const key = createHash('sha256').update(body.requestId).digest('hex');
      const fingerprint = createHash('sha256').update(JSON.stringify(body)).digest('hex');
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const destination = join(directory, `${key}.json`);
      const save = async (): Promise<ApplicationReceipt> => {
        try {
          const existing = JSON.parse(await readFile(destination, 'utf8'));
          if (existing.fingerprint !== fingerprint) throw new Error('Request conflict');
          return existing.receipt;
        } catch (err) { if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err; }
        const receipt: ApplicationReceipt = { reference: `THG-${key.slice(0, 12).toUpperCase()}`, jobTitle: job.title, submittedAt: new Date().toISOString(), mode: data.mode };
        const temporary = join(directory, `.${randomUUID()}.tmp`);
        try {
          await writeFile(temporary, JSON.stringify({ receipt, fingerprint, application: body }, null, 2), { flag: 'wx', mode: 0o600 });
          await rename(temporary, destination);
        } finally { await unlink(temporary).catch(() => {}); }
        return receipt;
      };
      const pending = inFlight.get(key) ?? save();
      inFlight.set(key, pending);
      try {
        const receipt = await pending;
        const stored = JSON.parse(await readFile(destination, 'utf8'));
        if (stored.fingerprint !== fingerprint) { res.status(409).json({ message: 'This submission changed during a retry. Please reload the form before submitting again.' }); return; }
        res.status(201).json(receipt);
      } finally { if (inFlight.get(key) === pending) inFlight.delete(key); }
    } catch (err) {
      res.status((err as Error).message === 'Request conflict' ? 409 : 503).json({ message: 'We could not confirm your application. Your form is still here; please try again.' });
    }
  });
  router.use((err: { type?: string }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.type === 'entity.too.large' ? 413 : 400).json({ message: 'The upload could not be read. Choose a PDF or DOCX file under 5 MB and try again.' });
  });
  return router;
}

function validJob(job: Job): boolean {
  return !!job && ['id', 'slug', 'title', 'department', 'location', 'workplace', 'employmentType', 'summary'].every(key => typeof job[key as keyof Job] === 'string' && String(job[key as keyof Job]).trim().length > 0)
    && /^[a-z0-9-]+$/.test(job.slug) && [job.responsibilities, job.qualifications].every(list => Array.isArray(list) && list.length > 0 && list.every(item => typeof item === 'string' && item.trim()))
    && (!job.closingDate || /^\d{4}-\d{2}-\d{2}$/.test(job.closingDate) && Number.isFinite(Date.parse(job.closingDate)))
    && (!job.salary || typeof job.salary === 'string');
}
export function validateApplication(body: JobApplication): string | null {
  if (!body || typeof body !== 'object') return 'Please complete the application.';
  const limits: Record<string, number> = { firstName: 80, lastName: 80, email: 254, phone: 40, location: 160, profile: 500, introduction: 4000, jobId: 100 };
  for (const [key, max] of Object.entries(limits)) {
    const value = body[key as keyof JobApplication];
    if (typeof value !== 'string' || value.length > max || (!['profile', 'introduction'].includes(key) && !value.trim())) return 'Please check the required fields and their lengths.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || !/^[+()\d\s.-]{7,40}$/.test(body.phone) || body.phone.replace(/\D/g, '').length < 7) return 'Please enter a valid email address and phone number.';
  if (body.profile && !/^https?:\/\/[^\s]+$/i.test(body.profile)) return 'Profile links must start with https:// or http://.';
  if (body.consent !== true || body.website !== '' || !/^[a-f0-9-]{36}$/i.test(body.requestId)) return 'Please review the application and consent before submitting.';
  const resume = body.resume;
  if (!resume || typeof resume.name !== 'string' || resume.name.length > 200 || /[\\/\x00-\x1f]/.test(resume.name) || !/\.(pdf|docx)$/i.test(resume.name) || typeof resume.data !== 'string' || resume.data.length > Math.ceil(MAX_RESUME_BYTES / 3) * 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(resume.data)) return 'Upload a PDF or DOCX resume under 5 MB.';
  const bytes = Buffer.from(resume.data, 'base64');
  if (!bytes.length || bytes.length > MAX_RESUME_BYTES) return 'Upload a PDF or DOCX resume under 5 MB.';
  const pdf = /\.pdf$/i.test(resume.name) && bytes.subarray(0, 5).toString() === '%PDF-';
  const docx = /\.docx$/i.test(resume.name) && bytes.length >= 4 && bytes.readUInt32LE(0) === 0x04034b50 && bytes.includes(Buffer.from('[Content_Types].xml')) && bytes.includes(Buffer.from('word/document.xml'));
  return pdf || docx ? null : 'The file contents do not match a PDF or DOCX document.';
}

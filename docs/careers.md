# Careers

## Applicant experience

- `/careers`: editorial careers overview, working role search and hiring process.
- `/careers/jobs`: searchable roles with team/location filters stored in the URL.
- `/careers/:slug`: responsibilities, qualifications, role facts and Apply now.
- `/careers/:slug/apply`: details, resume, review/edit and consent, then server submission.
- `/careers/application/success`: receipt and next steps. A direct visit without a receipt does not claim success. Only the reference, role, date and mode are stored in session storage; applicant details and resume are not.

Existing About navigation and the footer link to Careers. Missing/expired roles cannot accept applications. The server rechecks availability at submission. Errors preserve form fields, navigation warns about unsent work, repeated identical submissions reuse the receipt, and confirmation is displayed only after the application is saved. PDF and DOCX uploads have a 5 MB limit and server-side signature checks.

## Current mode

**Preview by default.** Four illustrative roles live in `src/app/core/data/careers-preview.data.ts`; they are not approved vacancies. Preview pages are marked noindex and identify test roles/forms clearly. Preview submissions are saved in the gitignored `.data/careers-preview` directory. No email or external ATS submission is performed. Do not enter real applicant information during preview.

Run `npm run build`, then `npm run serve:ssr:the-howell-group`, and visit `http://localhost:4000/careers`. The Express server owns `/api/careers` and `/api/careers/applications`; a static-only host will not support submissions. The local development server can also run with `npm start`.

## Enabling real vacancies

Supply approved content and set these **server-only** environment variables before starting the Node server:

| Variable | Value |
| --- | --- |
| `CAREERS_MODE` | `live` |
| `CAREERS_JOBS_FILE` | Path to an approved JSON array of jobs matching `Job` in `src/app/core/models/careers.models.ts` |
| `CAREERS_STORAGE_DIR` | Absolute path to a private, persistent directory, outside public assets, source and build output |
| `CAREERS_PUBLIC_ORIGIN` | Public origin, e.g. `https://thehowellgroup.co`; required when HTTPS terminates at a reverse proxy |

Required job fields: `id`, `slug`, `title`, `department`, `location`, `workplace`, `employmentType`, `summary`, `responsibilities` and `qualifications`. Optional: `salary` (approved display text) and `closingDate` (`YYYY-MM-DD`, inclusive through the end of that UTC date). IDs and slugs must be unique. An empty array means no open vacancies. The server rereads the file for listing and submission, so vacancies can be closed without rebuilding. Invalid live configuration returns an unavailable state; it never substitutes preview vacancies.

## Receiving applications

The included backend is a **single Node-process, private filesystem inbox**. Each application is one JSON file containing a receipt and the submitted fields, plus the resume as base64 with its original display filename. Files use generated names; uploaded filenames are never used as filesystem paths. The server exposes no public read/list route for applicant records. Request IDs provide idempotent retries; atomic temporary-file rename prevents partial records from being acknowledged.

To launch, arrange access to this private inbox for the hiring team, or replace the save operation with the organization's approved ATS/database integration. Email delivery, recruiter authentication/UI, automated screening and an ATS integration are not configured. Do not deploy this storage adapter to ephemeral/serverless disks or multiple application processes; use a shared database/object store and shared rate limiter for that deployment model. Configure access controls, backups, retention/deletion and malware scanning with the hosting owner. Signature checks verify basic file format, not malware safety. Avoid opening untrusted resumes automatically.

The application notice is deliberately limited to the behavior implemented here. The organization should approve its recruiting content and data-handling policy before real applications are enabled. No compensation or benefit claims were invented.

## Verification

`node --test scripts/careers-api.test.cjs` checks preview/live catalogs, persistence, concurrent duplicate submissions, invalid input and documents, expired roles, origin rejection, and protected storage paths. `node node_modules/@angular/cli/bin/ng.js build` checks Angular templates and production SSR compilation.

Manual browser checks cover search and zero results, team filtering, role navigation, field and resume requirements, test upload, consent validation, actual submission, receipt persistence after refresh, and responsive layout.

Reference patterns: [Turner careers](https://www.turnerconstruction.com/careers) and [Skanska job search](https://careers.usa.skanska.com/operations/jobs). The Howell visual treatment and copy are original to this implementation.

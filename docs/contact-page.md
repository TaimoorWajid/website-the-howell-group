# Contact page

Implemented a lazy Contact route with the compact introduction, architectural inquiry image, one three-step reactive form, three conversation prompts, and About closing link. Global header/footer and other pages are untouched. New source is in `src/app/features/contact/`; the only shared integration change is `/contact` in `app.routes.ts`.

The typed form has personal, project and discussion groups. Next validates only the current group and focuses its first invalid control; Previous preserves values without validation. Completed steps can be revisited, but invalid earlier groups cannot be skipped. Final submission revalidates all groups. Earlier Enter presses advance rather than submit. Step changes use a 200ms transition and heading focus; typing does not trigger animation. Mobile renders form before image, one-column controls and compact progress. Reduced motion removes decorative and step animation.

Whitespace-only required text is rejected, email uses Angular's email validator, city is limited to 250 characters, and additional information to 1,000. Project details has no arbitrary cap. Phone selection supports US, Canada, UK, Australia, India and Pakistan with country-specific national-format checks and consistent international normalization. These are formatting checks, not carrier or number-ownership verification; no existing international-phone control or dependency was available. Further supported countries can be added centrally.

## Required production configuration

The following authoritative dropdown lists are absent from the repository and API model definitions:

- Project type
- Project estimated value (including approved currency/ranges)
- Project stage
- Target start
- State

All five are centralized in `contact-form.config.ts` with empty typed option arrays. The UI explicitly marks them unavailable; required validation blocks Step 2 advancement and submission until real values are supplied. No placeholder choice passes validation, and no categories, ranges, stages or locations were fabricated. All three states are implemented, but the form is **not ready for production submission while these lists are missing**.

## API integration

Reuses `ContactApiService.submitInquiry` and the existing configured `/contact` resource. The established `ContactInquiry` contract contains `name`, `email`, `phone`, `company`, and a string `message`; it has no structured fields for the new project data. Name/email/company and normalized international phone use those existing top-level fields. First/last names, role, phone country/dial code/original input, every project selection (label and backend value), city, project details and additional information are retained explicitly in the message. No fields are silently discarded and the backend contract is not changed.

Only the final submit calls the API. Pending state locks the form and stepper and prevents duplicate requests. Success appears only on the HTTP Observable's successful response; errors retain all values and show the supplied failure copy. Subscriptions and animation/frame resources are disposed on destruction. No PII persistence or live inquiry was added/sent. Backend acceptance of this serialized message format still requires later integration verification; no endpoint availability or delivery claim was made.

The image reuses the existing local `concrete-interior.webp` as representative architecture, with empty decorative alt. It is not identified as a Howell project. Approved Contact-specific photography can replace it. No stock founders, new contact details, privacy route, attachments or mandatory consent checkbox were invented.

## Deferred verification

Only brief source review was performed. No automated tests were created or run; no build, lint sweep, browser audit, SSR/hydration check, responsive testing or live submission was performed, as requested. No commits or pushes.

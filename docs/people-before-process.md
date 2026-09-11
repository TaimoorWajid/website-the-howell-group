# People Before Process

Replaces only the previous homepage About block, immediately after Services and before Insights. No adjacent spacing adjustments or changes to completed sections were necessary.

Files: `src/app/features/home/components/people-before-process/people-before-process.component.{ts,html,scss,spec.ts}`, homepage component TS/HTML/SCSS integration, and homepage structure test.

The editorial composition uses the existing tokens, a 53/47 copy/image split, exact supplied copy, semantic h2, and an Angular `/about` link. The image area reserves its layout before loading. Below 768px the content stacks before a 4:3 image, with natural heading wrapping and a 48px CTA. Tablet retains the split with actions stacked for readability.

The scoped GSAP timeline lasts 1.37 seconds: right-to-left image mask, 1.04-to-1 scale settle, eyebrow fade, masked desktop heading lines, body and staggered CTA/founder line. Mobile reveals the naturally wrapping heading as one block. There is no pin or parallax. Browser-only setup uses `afterNextRender` and existing AnimationManagerService. Reduced motion immediately restores the final state; keyboard focus also reveals content immediately. Destruction kills the trigger, reverts the context and removes the preference listener.

## Image limitation

No verified founder or collaboration photograph exists among the repository's assets. `/images/projects/project-04.jpg` is reused temporarily as an atmospheric office-interior fallback, with empty alt and no identification of people. It is not a photograph of the founders and does not satisfy the intended people-collaborating composition. An approved collaboration photograph is still needed; the user has been asked for its existing file location. No new image was downloaded or generated. Source provenance is already documented in `public/images/projects/README.md`.

## Verification

All 60 unit tests pass. Component tests cover exact copy and link, image dimensions, desktop/tablet/mobile widths (1600, 1440, 1280, 1024, 900, 768, 430, 390, 360), animation duration/mask, reduced-motion cancellation, focus reveal and teardown/revisit. The homepage test verifies placement between Services and Insights. Production SSR build and HTTP smoke checks verify visible server-rendered content, `/about`, and a successful local image response. The initial bundle remains above the existing 500 kB warning budget; the budget was not changed.

Manual visual browser and hydration review were not performed. Automated DOM/animation checks and SSR HTTP checks do not constitute visual acceptance. No new dependencies, commits or pushes.

# Services landing page

The existing `/services` placeholder is replaced with a lazy-loaded page. Homepage files, global header/menu/mobile navigation, footer, and `/services/:slug` remain unchanged. No dependencies, new scrolling engine, or duplicate Three.js foundation were introduced.

## Files

- `src/app/app.routes.ts`: lazy page mapping for `/services` only.
- `src/app/features/services/services-page.component.{ts,html,scss}`: composition, scoped sticky mission scene, accessible engagement accordion, closing CTA, Services SEO.
- `services-hero.component.{ts,html,scss}`: independent text/CTAs and progressive WebGL enhancement.
- `services-portal.{data.ts,scene.ts,scene.spec.ts}`: procedural portal construction, demand rendering, cleanup, real WebGL and lifecycle tests.
- `service-story.component.{ts,html,scss}`: scoped sticky service navigation/image frame, chapter state, directional image transitions, anchor focus/scrolling.
- `services-capabilities.component.{ts,html,scss}`: informational cards and bounded fine-pointer effects.
- `services.data.ts`: authoritative chapter, capability and engagement copy.
- `services-page.component.spec.ts`: content, layout, links, accordion, anchors, reverse progression, release, pointer and re-entry coverage.
- `scripts/generate-services-portal.mjs` and `public/images/services/portal-poster.svg`: reproducible static architectural poster from the same geometry definition.

## Interaction and accessibility

The portal scene uses five concrete-colored structural frames, side walls, paving, a water strip, and courtyard planters. Camera travel is limited to a gentle two-unit dolly plus a small lateral adjustment, scrubbed while the hero leaves; no pin or continuous rotation. It reuses the core camera/renderer/scene services. The poster is immediately present and disappears only after successful rendering. Mobile and reduced-motion devices use the poster. DPR is capped at 1.5, geometry/materials are shared, and rendering happens on demand only while visible. Teardown cancels frames, disconnects observers, removes listeners, disposes resources, releases the context, and guards late imports.

Service navigation and its stationary image frame are sticky only inside the service-story section. The current global header is in normal flow, so the sticky offset is zero; a ResizeObserver reserves measured header height if its actual position is fixed/sticky. Chapter links use the existing Lenis service in normal motion and native immediate scrolling for reduced motion, with native hash links preserved and focus transferred to the heading. The four chapters each occupy substantial reading distance. One scroll observer selects a stable active chapter from its position, in both directions; image transitions crossfade and clip upward/downward accordingly. Desktop uses a single image frame, mobile pairs each image with its chapter, and reduced motion removes extended sticky reading space.

The mission photograph is sticky within its own section while semantic statements naturally scroll upward. Mobile/reduced motion use a compact static composition. Capability cards are articles without fake links, arrows, pointer cursors or tab stops. Fine-pointer effects are capped at 2 degrees, 4px lift and 1.025 image scale, disabled for touch/reduced motion, and clean up on exit/navigation.

The accordion uses buttons, controlled labelled regions, expanded state, inert closed panels, and 250ms grid-row transitions. First item opens initially after hydration; without JS all answers are visible. Enter/Space use native button behavior; Up/Down/Home/End move between headers. SSR emits all content, links and image dimensions. Effects initialize after rendering with existing GSAP registration, reduced-motion handling, and explicit context teardown. The footer is provided only by the global shell.

## Production assets and destinations still needed

No published service-detail content exists: `/services/:slug` still maps to the foundation placeholder. Accordingly the four chapter CTAs read “Discuss [service]” and point to `/contact`, rather than claiming working service detail pages. Replace these only when content/slugs are verified.

All existing photography is representative and does not establish Howell project/staff identities:

| Use | Current asset | Production replacement |
| --- | --- | --- |
| Program chapter | `images/projects/project-01.jpg` | Approved planning/drawings photograph |
| Design chapter | `images/projects/project-02.jpg` | Approved design-study photograph |
| Construction chapter | `images/why-howell/concrete-interior.webp` | Approved construction coordination photograph |
| Consulting chapter | `images/projects/project-04.jpg` | Approved project collaboration photograph |
| Mission interlude | `images/projects/project-04.jpg` | Approved architectural corridor photograph |
| Capability cards | Existing project/interior images | Approved architectural material studies |
| Closing | `images/why-howell/concrete-interior.webp` | Optional approved architectural-shadow photograph |

The procedural hero and generated poster are local replaceable studies; no external model or photograph was downloaded. The reference screenshot and annotation column are not used as page assets.

## Verification

All 69 unit tests pass, including existing homepage/navigation regressions. Production Angular SSR build passes with an initial-bundle warning (existing budget remains 500 kB; not increased). HTTP smoke checks confirm all seven sections, one h1/header/footer, poster HTTP 200, and successful homepage/Contact/detail-placeholder responses. Automated tests cover nine widths from 1600 to 360px, semantic content/destinations, native and Lenis anchor dispatch, accordion behavior, forward/reverse chapter selection, sticky release, bounded pointer effects, reduced-motion JS fallback, context cleanup, and actual WebGL pixels.

The browser connector returned no available browsers, including after its documented discovery check. Manual visual acceptance, real trackpad/Lenis feel, and production-browser hydration review were not performed. CSS media-query behavior is implemented but mocked JavaScript preference tests do not emulate the browser's CSS reduced-motion preference. No lint script is configured. No commits or pushes.

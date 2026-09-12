# About page implementation

The `/about` route now lazy-loads `src/app/features/about/about-page.component.ts`. Only that route entry, new About-specific components/data/scene, and `public/images/about/perspective-alignment.svg` were added or changed. Homepage, Services, global navigation and footer are preserved. The existing header has no supported overlay mode, so its normal treatment is retained.

All seven requested sections are present: image-led hero with an inset scroll mask; readable purpose phrases with scroll emphasis; short reversible three-stage facade alignment; asymmetric founder profiles; accessible expanding value buttons; three-image editorial essay; and an outlined-word closing invitation. Approved copy lives in semantic HTML or typed page data. Discover uses existing Lenis/native reduced-motion scrolling; Services and Contact use Angular Router. About-specific metadata uses the existing SEO service.

The symbolic facade is a local procedural study of three glass/frame groups converging in depth and orientation. It does not represent a real Howell project. Existing renderer, camera and scene/disposal services are reused. One section-scoped timeline pins only the alignment viewport on larger screens. Mobile, short viewports, reduced motion and WebGL failure use normal-flow chapters with the static SVG. Rendering is demand-driven, capped at 1.5 DPR, paused offscreen/when the document is hidden, and cleaned up with observers/listeners/context resources on navigation. Other animations are scoped and reverted on media changes and destruction.

## Asset follow-ups

Verified founder photographs and biographies were not available. Marc Howell and Eric Laurin have neutral, explicitly labelled “Portrait forthcoming.” placeholders and only the supplied co-founder roles. No faces or biographies were invented.

Existing local architecture is representative: project-01 for the hero and Curiosity, project-02 for the purpose detail and Respect, project-04 for Collaboration and the large essay image, project-03 for the courtyard-direction essay image, and the existing concrete interior for Trust, essay detail, and closing. The essay's office-interior image is a deliberate stand-in for an approved collaboration/planning photograph; its exterior image is a stand-in for an approved courtyard image. Approved cinematic hero, planning/collaboration and courtyard photography may replace these local assets. No screenshot crop, external asset, or model was downloaded.

## Verification deferred by request

Only a brief source inspection was performed for obvious integration/cleanup mistakes. No automated tests were created or run. No production build, lint sweep, browser testing, visual verification, SSR/hydration test, or site-wide audit was performed. These remain deferred until the website is complete. No commits or pushes.

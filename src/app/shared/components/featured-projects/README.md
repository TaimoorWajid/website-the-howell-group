# Featured Projects

Standalone, signal-input component. HTML, SCSS, animation logic, model, samples and tests
are separated. The home page passes live API projects or five clearly labelled samples.
Replace public/images/projects/project-01.jpg through project-05.jpg and sample metadata
with approved work before launch. No project value, client or area is invented for API data.

## Motion

Reuses AnimationManagerService and the application's existing Lenis synchronization.
No extra Lenis instance, wheel interception or component RAF loop.
ScrollTrigger pins one viewport with pin spacing; a single scrubbed timeline is reversible.
Each handover lasts one timeline unit, with 0.2-unit opening/closing dwells.
Desktop travel is 1.15 viewport heights per handover; mobile uses 0.85.
Counter mapping mirrors those dwell intervals. Refresh recomputes travel and exit distance.

The current site header is in normal document flow, not fixed, so the pin starts at top 0.
If the header becomes fixed, adjust the trigger start and stage height together.

Reduced motion, viewports shorter than 520px, single-project data and the explicit
"Read as a list" option use normal-flow cards. SSR emits the same readable content.
GSAP media/context cleanup removes all transforms and pin spacers on input changes,
list-mode changes, responsive changes and destruction.

## Verification

Automated coverage: counter boundaries, fast seeks and reversal, pin configuration,
spacer cleanup, refresh, list mode, reduced motion, metadata and empty input.
Production server smoke checks cover rendered homepage HTML and local photo delivery.

Still requires a connected interactive browser for final visual acceptance:
slow/fast downward scroll, upward re-entry, immediate reversal, resize,
mobile touch, text overflow, console and transitions into/out of the section.
Do not treat timeline unit tests as a substitute for that visual review.

Interaction reference: https://skiper-ui.com/v1/skiper17 and supplied recording.
The implementation is original Angular code, not copied Skiper source.

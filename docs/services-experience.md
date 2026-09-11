# Homepage services experience

The old capabilities block is replaced in place, between Featured Projects and the existing About/People section. The only adjacent edits are the component import, removal of obsolete services data/styles, and template replacement. The final CTA's shared texture rule is preserved. No other section or core animation infrastructure changes.

## Files

- `src/app/features/home/components/services-experience/`: Angular component, HTML, SCSS, authoritative typed service/building data, focused scene controller, component and scene tests.
- `src/app/features/home/home-page.component.{ts,html,scss}`: integration and obsolete block removal.
- `scripts/generate-services-fallback.mjs`: deterministic SVG generator.
- `public/images/services/coordinated-building.svg`: complete model fallback generated from the same geometry specification.

## Architecture and behavior

No approved architectural GLB exists. The procedural study includes site/grid, program volumes, design floor plates, structural columns/beams/core, curtain-wall envelope bays, roof and entrance canopy. Program Management emphasizes site/program; Design Management emphasizes design/envelope; Construction Management emphasizes structure; Partnership & Consulting aligns all six groups. Geometry is constructed once with shared box/edge geometry and materials per layer. A future approved GLB can replace the focused scene controller without changing content or scroll orchestration; no replacement asset is required to use this implementation.

Desktop uses one master GSAP progress timeline with reversible interpolated layer transforms, opacity and restrained camera adjustment. Only the inner viewport is pinned, with pin spacing and three viewport heights of scroll travel. Four discrete active states use quarter thresholds. The last quarter holds the assembled model before release. Short viewports that cannot fit the composition use normal flow. Hover and focus preview the corresponding model state; focus has priority and leaving restores current scroll progress. All rows remain readable real links to `/services`: the generic detail route exists, but published detail slugs have not been verified.

At widths below 1024px the introduction sits over model/list columns and long pinning is removed. Below 768px content stacks vertically with the complete SVG illustration and intersection-driven row emphasis. Reduced motion uses the complete illustration without pinning, camera motion or scrub. Heading line masks reveal whole lines; active rules provide a non-color cue, links retain visible focus outlines and descriptions never disappear. Canvas and fallback are decorative; there is no noisy live region.

Initialization occurs only through Angular `afterNextRender`. SSR emits the heading, exact four descriptions, links and fallback. Dynamic scene imports reuse the existing renderer, scene/disposal, camera and GSAP registration services, with no new Lenis instance. The fallback stays visible until a successful first frame. Context loss or initialization failure restores fallback and removes the pin.

DPR is capped at 1.5. Rendering is invalidation-driven, coalesced to one requested frame, and paused outside the section or hidden document. ResizeObserver updates the camera and renderer. Teardown reverts GSAP media contexts and pins, kills preview tweens, disconnects observers, removes listeners, cancels scheduled frames, disposes shared resources and releases the WebGL context. Async imports check teardown before creating a scene.

## Verification

All 56 configured Karma/Chrome tests pass. Coverage includes exact content/routes, initial and preview state, requested widths (1600, 1440, 1280, 1024, 900, 768, 430, 390, 360), reduced-motion fallback, reversible quarter thresholds, final layer alignment, desktop pin ownership/distance/teardown, actual WebGL pixels, offscreen rendering pause, and context-loss disposal. Existing homepage tests cover surrounding section integration.

Production SSR build and an HTTP smoke check verify server-rendered copy, four service links, a successful SVG response, and absence of server-created canvas. The build reports an initial JavaScript budget warning; no budget was loosened. There is no configured lint script.

Manual visual review, live trackpad/Lenis feel, and production-browser hydration/navigation review remain unverified because the browser connector is unavailable. Automated DOM/layout and WebGL tests do not substitute for that visual acceptance pass.

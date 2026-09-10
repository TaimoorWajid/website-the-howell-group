# Homepage architectural hero

## Scope and files

Only the homepage hero was replaced. The header/navigation, intro and later homepage sections, footer, routes, API calls, SEO configuration and Lenis integration are unchanged.

- `src/app/features/home/components/home-hero/home-hero.component.*`: semantic marketing layout, exact approved copy, CTA routes, measured header height, scoped text entrance and responsive styling.
- `src/app/features/home/components/home-hero-three/home-hero-three.component.*`: browser-only deferred scene loading, fallback and preference/viewport lifecycle.
- `hero-scene.controller.ts`: scene construction through existing ThreeRendererService, ThreeSceneService and ThreeCameraService; scoped animation and resource ownership.
- `architectural-study.data.ts`: typed, replaceable building geometry and material palette.
- `public/images/hero/architectural-study.svg`: the same building study in its settled hybrid state, used without JavaScript/WebGL, on mobile, with reduced motion, and on constrained/data-saving devices.
- `scripts/generate-hero-fallback.mjs`: regenerates that SVG from the shared geometry, without external assets or dependencies.
- Homepage template/TS/SCSS: mount the new hero and remove only the former hero markup, styles and page-owned entrance. Shared texture rules for later sections are preserved.
- Existing Three renderer service: optional pixel-ratio cap; disposal utility: deduplicate shared geometry/material/texture disposal. The existing local Three type declarations were extended for the APIs now used.
- `karma.hero.cjs`, hero specs and the updated homepage spec: focused layout, interaction, WebGL and regression coverage.

## Composition and scene

The pale mineral desktop hero uses a 44/56 split and a minimum height based on the actual existing header height. The heading is two lines where desktop space permits; mobile uses natural wrapping and stacks the visual after the text/CTAs. Existing font, color and gutter tokens are retained. There is one h1, real Projects/Contact router links, visible focus styling, SVG arrows and 48px CTA targets. The decorative visual contributes no unique content or screen-reader narration.

No approved GLB/GLTF was present. The procedural study has 231 lightweight parts sharing a unit box and edge geometry: four floors, curtain-wall bays, structural columns, floor slabs, a concrete spine, roof blades, a projecting glazed entry and a timber canopy. Daylight is provided by a hemisphere light, a directional light and a small generated environment texture. The scene uses clipped solid materials and fine teal technical edges; its left side remains a drawing even at the end of the reveal.

The study is illustrative and must not be represented as an actual Howell project. A verified project model can eventually replace `buildStudy`; update/regenerate its static fallback at the same time. There are no invented client names, project metrics or building labels.

## Animation and lifecycle

Text entrance is scoped to the hero with AnimationManagerService/GSAP. The scene entrance takes about 1.8 seconds, with a restrained camera settle and progressive material clipping. If the scene bundle arrives late, it starts composed instead of delaying the experience with another intro. The static visual stays present until a successful first render.

One unpinned scene ScrollTrigger adds a small amount of reveal/alignment and desktop depth while scrolling; reverse scrolling restores that contribution. There is no spacer or artificial scrolling distance. Fine-pointer desktop input eases camera offsets through GSAP quickTo; touch and tablet/small-screen input do not control the camera.

Three.js is a dynamic chunk requested after essential content paints. Mobile at the existing 48rem homepage breakpoint, reduced-motion, save-data and low-memory devices use the static SVG without initializing WebGL. Preference/viewport changes dispose or recreate the scene safely. Reduced-motion text is immediately visible without an entrance timeline.

Renderer DPR is capped at 1.5 on desktop and 1 at laptop sizes. Laptop shadows are disabled; desktop uses a 1024px PCF map. Rendering is invalidation-driven, coalesced to one animation frame, paused out of view or in a hidden tab, and stops when nothing changes. Destruction cancels pending frames/import activation, disconnects observers/listeners, kills scoped GSAP/ScrollTrigger state, disposes shared geometry/materials/textures and shadow resources, removes the canvas and releases its WebGL context. A lost context returns to the static image.

## Verification

Run:

    node scripts/generate-hero-fallback.mjs
    npm.cmd run build
    npm.cmd test -- --watch=false --karma-config=karma.hero.cjs --browsers=ChromeHeadlessHero --include=src/app/features/home/**/*.spec.ts --include=src/app/shared/components/featured-projects/*.spec.ts --include=src/app/shared/components/scroll-reveal-grid-cards/*.spec.ts

Set CHROME_BIN to the installed Chrome executable if needed. The hero launcher enables software WebGL specifically for the real-renderer test.

25 tests passed. They cover exact content/routes, real viewport widths 1600/1440/1280/1024/768/430/390/360, two-line desktop composition, no horizontal overflow, touch targets, reduced motion, WebGL initialization failure, deferred initialization cancellation, nonempty real WebGL output, pointer/touch differences, forward/reverse scroll, no pin, idle rendering, context loss, resource disposal and adjacent-section regressions.

The production SSR build and HTTP response are checked separately. There is no configured lint command. The browser connector reported no available browser; interactive visual comparison, physical touch-device testing and end-to-end hydration console inspection are not claimed. The static geometry was rasterized for composition review; automated WebGL testing verifies rendering rather than subjective visual quality.

Final checks: production build passed (521.20 kB initial bundle; 21.20 kB above the existing warning budget). The current production server returned HTTP 200 with exactly one h1, both approved heading lines, the body copy and both CTA routes, the static SVG, and no server-created canvas. The SVG returned HTTP 200 (109,756 bytes). No dependencies were added; nothing was committed or pushed.

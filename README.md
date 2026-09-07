# The Howell Group

The Howell Group is an Angular 21 standalone, zoneless, SSR/hybrid frontend for a headless WordPress installation. The homepage experience is implemented on top of a reusable production foundation; deeper CMS-driven page experiences remain incremental work.

## Local development

```bash
npm install
npm start
```

Build and test with `npm run build` and `npm test -- --watch=false`. The SSR production server can be started with `npm run serve:ssr:the-howell-group` after a build.

## Architecture

Routes are defined in `src/app/app.routes.ts` and share a global header/footer shell. The homepage lives in `src/app/features/home` and is split into focused section components. Future feature pages should be added as lazy feature routes without putting API or animation logic in templates. The public app talks only to the public WordPress REST API at the configured `/wp-json/howell/v1` base URL; no WordPress or database credentials belong in this project.

The API layer lives under `src/app/core/api` and exposes typed services for projects, services, team, testimonials, insights, careers, and contact. Models live in `src/app/core/models`.

GSAP and ScrollTrigger are registered once by `AnimationManagerService`. DOM work must be created through that service, guarded by browser detection, and reverted with a GSAP context. `SmoothScrollService` initializes Lenis once, syncs it with ScrollTrigger, and disables it for reduced-motion users. Three.js services provide browser-only renderer, camera, scene, asset-loading, and disposal primitives; no scene is created yet.

## Configuration

The Angular CLI development file replacement selects `src/environments/environment.development.ts`; production uses `src/environments/environment.ts`. Both currently point to the remote public CMS API. Only public URLs may be configured here.

## Design and accessibility

Design tokens are centralized in `src/styles/_variables.scss`. The palette is restrained white/off-white/charcoal/teal with red reserved as an accent. System font fallbacks are used until approved brand fonts are supplied. Global focus states and reduced-motion behavior are included; future interactions must preserve keyboard access, semantic structure, meaningful image alt text, and readable content without hover or animation.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system map and implementation rules.

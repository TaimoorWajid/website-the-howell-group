# Foundation architecture

## Content flow

```text
Angular SSR / browser
        ↓
Typed API services (src/app/core/api)
        ↓
WordPress REST API (/wp-json/howell/v1)
        ↓
WordPress + ACF
        ↓
MySQL / MariaDB
```

Components never call `HttpClient` directly. Resource-specific services expose typed observables and the shared `ContentApiService` owns URL construction. The API can be unavailable while the shell still compiles and renders because data is requested only by future feature pages.

## Motion flow

```text
Feature component
        ↓
AnimationManagerService / scoped GSAP context
        ↓
GSAP + ScrollTrigger

Application shell → SmoothScrollService → Lenis → ScrollTrigger
Future high-value scene → Three services → renderer / camera / scene disposal
```

Animation initialization must be browser-only. Use `AnimationManagerService.createContext()` for DOM animations and revert the context when the owning component is destroyed. Do not register plugins or create a Lenis instance per component. Respect `prefers-reduced-motion`; decorative animation and WebGL are optional, never content-critical.

## Rendering and SEO

Angular SSR uses server rendering for all routes so dynamic content can later produce crawlable HTML. `SeoService` updates title, description, robots, Open Graph, Twitter, and canonical metadata from route or resource data. The production site should add a generated sitemap and JSON-LD strategy once CMS schemas are finalized.

## Folder map

```text
src/app/core        API, configuration, models, animation, scroll, SEO, Three.js
src/app/layout      global header, footer, navigation shell, cursor placeholder
src/app/shared      reusable components and future directives/pipes
src/app/features    route-owned page implementations, currently including home
src/styles          centralized tokens, typography, and utilities
src/environments    public build-time configuration
```

# Why Howell section

## Scope and files

Created `src/app/features/home/components/why-howell-section/why-howell-section.component.{ts,html,scss,spec.ts}` and local photography under `public/images/why-howell/`.

Modified only the homepage template/imports to replace its previous positioning block, removed that block's now-unused SCSS, and extended the homepage test to assert hero -> Why Howell -> scroll-card ordering. No adjacent-section spacing or design was changed. Existing uncommitted hero work is preserved.

## Layout and content

The section uses the exact approved eyebrow, h2, paragraph and About CTA. Desktop has a full-bleed 40% photograph and a 60% white content area with existing typography/color/gutter tokens. Height is clamped between 650px and 820px around 78svh. The heading remains two lines at the tested desktop widths. Below 768px, copy comes first, height becomes natural, and the photo becomes a 4:3 crop.

The image is atmospheric concrete-stairwell photography with natural light and human scale. Local 800px and 1400px WebP variants are selected through sizes/srcset, with an explicit-dimension JPEG fallback. It is lazy-loaded below the full-viewport hero. Its reserved grid area prevents image-loading layout shift. Photo provenance and the remaining company-asset verification distinction are recorded in the image folder README.

## Animation

A single scoped GSAP timeline is attached through the existing AnimationManagerService to an unpinned, once-only ScrollTrigger at `top 76%`:

- 0.00s: image mask opens from the left; image settles from scale 1.04.
- 0.08s: thin architectural SVG paths trace in.
- 0.16s: eyebrow fades/rises.
- 0.28s: heading masks reveal sequentially.
- 0.58s: three semantic paragraph segments reveal.
- 0.96s: outlined CTA fades/rises.
- 1.12s: directional SVG arrow settles.

The sequence ends around 1.42s. Mobile simplifies the paragraph to natural inline wrapping and omits the secondary datum path. No pin, scroll listener, parallax loop, new GSAP registration or Lenis instance is added. Explicit image dimensions and transform-only reveals mean no extra ScrollTrigger refresh is needed.

## Accessibility, fallback and cleanup

One h2 follows the hero's h1, with natural full text and no duplicate announcements. The paragraph remains selectable text. The photo and linework are decorative; the CTA is a real `/about` RouterLink with a 48px minimum height and visible keyboard focus. Focus entering the section restores its fully visible state before interacting with the CTA.

The default SSR/no-JavaScript markup is readable. Browser-only enhancement uses afterNextRender. Reduced-motion users see the finished layout immediately; enabling reduced motion while the sequence is pending reverts all animation styles. Setup failure also restores the readable state. Destruction reverts the GSAP context, kills the owned trigger and removes the preference listener. Minor reverse scrolling does not replay the reveal.

## Verification

Focused command:

    npm.cmd test -- --watch=false --karma-config=karma.hero.cjs --browsers=ChromeHeadlessHero --include=src/app/features/home/**/*.spec.ts --include=src/app/shared/components/featured-projects/*.spec.ts --include=src/app/shared/components/scroll-reveal-grid-cards/*.spec.ts

The tests cover exact copy/route, 1600/1440/1280/1024/768/430/390/360px layouts, desktop line count, mobile ordering/crop, horizontal overflow, once-only animation and reverse scroll, keyboard visibility/navigation, reduced-motion changes, setup failure, trigger cleanup and preservation of adjacent components.

The source photograph was visually inspected. The browser connector reported no available browser, so interactive screenshot comparison, physical touch-device testing and full hydration-console inspection are not claimed. No lint command is configured. No dependencies were installed; nothing was committed or pushed.

Final results: all 31 focused and regression tests passed. Production SSR build passed with a 526.37 kB initial bundle (26.37 kB above the existing warning budget). HTTP checks returned 200 for the homepage and all three image variants; server HTML contained the exact heading, copy, About route and image in the correct section order, without hidden animation styles. git diff --check passed.

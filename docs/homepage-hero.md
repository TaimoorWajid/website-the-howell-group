# Homepage video hero

The homepage uses a full-width, muted local video behind the existing approved copy and Projects/Contact links. The navigation and later sections are unchanged.

## Media provenance

The user supplied https://www.youtube.com/watch?v=ExdPwNVm_mY and explicitly confirmed Howell owns the footage. The video is titled Aliso Viejo Behavioral Hospital. A rooftop tracking sequence around 00:25-00:46 is used, with a one-second wraparound crossfade.

- `public/videos/howell-hero.mp4`: approximately 20 seconds, 1280x676, H.264, 30 fps, no audio, fast-start MP4, approximately 5.24 MB.
- `public/images/hero/howell-hero-poster.jpg`: still from the same sequence, approximately 197 kB.
- `public/images/hero/architectural-study.svg` and the former Three.js components remain available for reuse. They are no longer mounted by the hero.

The downloaded source and temporary media tools live under ignored `tmp/`; they are not runtime dependencies.

## Behavior

The video source is assigned after browser rendering only. Reduced-motion and save-data users initially see the poster without fetching the clip. A keyboard-accessible Play/Pause button allows explicit playback. Playback pauses offscreen or when the document is hidden, respects a manual pause, and releases the media source when the component is destroyed. Failed playback retains the poster and usable text/links. SSR and no-JavaScript rendering provide the poster and content.

The hero uses a dark teal gradient for text contrast, responsive typography, and the existing measured header height. The desktop and mobile layouts use the same background with cover cropping.

## Verification

Production build: passes with an initial-bundle budget warning (586.06 kB against 500 kB).
Focused hero and homepage tests: seven pass, covering reduced motion, explicit play/pause, preference changes, media errors, cleanup, approved copy/routes, and page structure.

## Scroll geometry follow-up

The homepage now observes section border-box size changes and refreshes scroll measurements on the next animation frame. This covers the scroll-card runway expansion after Angular rendering, header/hero sizing, responsive changes, and later content changes. AnimationManagerService measures triggers in document order so upstream pin spacing is included downstream. Observers and scheduled frames are removed with the page.

Twelve targeted tests pass, including full-page pin geometry before and after an upstream 320 px height change. Browser scrolling verified the Projects-to-Services boundary in both directions on desktop and forward on mobile; project six releases once without dropping back into view. The Services exit into subsequent content was also inspected.

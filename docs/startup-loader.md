# Startup loader

The loader is visible in the initial HTML before JavaScript starts, preventing a flash of page content. No-JavaScript visitors see the page without the overlay; a failed loader script also removes it.

It is removed immediately once the initial Angular route is ready to paint and the native window load event has completed. There is no minimum duration, completion hold, or exit fade. Background video and lazy assets do not delay dismissal. Percentages describe readiness milestones, not transferred bytes.

Manual skip, bootstrap failure, or an eight-second fallback timeout releases the page. While active, app-root is inert. Dismissal restores interaction and focus without changing page dimensions. The loader does not replay on SPA navigation.

Implementation: src/index.html, public/startup-loader.js, src/main.ts.
Focused checks: node --test scripts/startup-loader.test.cjs.

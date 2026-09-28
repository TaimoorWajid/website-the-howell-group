# Startup loader

The initial document includes a centered client logo, gentle opacity pulse, two-pixel teal progress bar, readiness percentage, and a Continue to website button. The screen fades out once the initial route, window load, fonts, visible images, and the first frame of visible video are ready. It does not replay on client-side navigation.

The percentage tracks completed readiness milestones and a fixed first-screen asset set, not transferred bytes. Offscreen lazy images and the entire background video are deliberately excluded. Failed media requests count as settled so fallback content can appear. Startup failure, manual skip, or an eight-second timeout clears the overlay without claiming complete loading.

The overlay is hidden by default for no-JavaScript visitors. While active, app-root is inert; dismissing the overlay removes inert and restores content focus if the visitor used the continue button. Reduced motion disables the logo pulse and fade. No body overflow or section dimensions are changed, preserving scroll pin measurements.

Implementation: src/index.html, public/startup-loader.js, src/main.ts.
Validation: node --test scripts/startup-loader.test.cjs (four tests); npm run build.

Cached reloads now keep the loader visible for at least 1.5 seconds (400 ms with reduced motion). Slow loads only keep the short completion hold. Manual skip and failure still dismiss immediately. The versioned script URL refreshes cached copies. Five loader tests pass.

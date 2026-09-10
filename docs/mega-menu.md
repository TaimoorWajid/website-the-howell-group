# Header and navigation

The existing HeaderComponent owns desktop disclosure state and the shared SmoothScrollService lifecycle. Its normal-flow positioning is preserved. Desktop navigation is displayed at 768px and above; mobile navigation is used strictly below 768px. There were no sticky/transparent header states in the original implementation.

## Content and icons

Edit `src/app/layout/header/mega-menu.data.ts` for menu content and item icons. Both navigation experiences consume the same typed configuration, including every overview, submenu and feature destination. `navigation-icon.component.ts` contains the small SVG line-icon collection; no icon font, Unicode arrow or additional package is required. The former visible question marks were literal template text and have been replaced by SVG arrows.

The desktop panel retains its layout, images, typography and colors, with consistent low-contrast column/item separators and accessible full-row links. Its height follows the actual header edge and scrolls internally on short screens.

Projects, Services, About and Insights retain existing labels; Contact remains direct. Careers is inside About in both experiences. Industry/location menus remain deferred because there are no corresponding routes or verified company locations. Existing service links use their valid parent route until detail content is published. Existing foundation pages are unchanged.

Insights lazily requests the existing InsightApiService. A published item's title, image, date and route supply the feature; otherwise the feature links to the Insights index without invented metadata. Mobile retains that feature destination as a text link.

## Mobile behavior

`mobile-navigation.component.*` implements a full-height dark-green native modal dialog, visible logo, close button, one-open-at-a-time accordions and bottom project CTA. It shares menu data without rendering desktop feature images. Native modal semantics make background content inert; focus starts on Close, Tab remains within the panel, and dismissal returns focus to the opener. Escape, close button, route links and routing close the dialog. Crossing to desktop immediately closes it and focuses the desktop brand.

Only the mobile modal pauses the existing Lenis instance and locks background overflow. Existing inline overflow/padding values and priorities are restored on dismissal or destruction; scrollbar compensation avoids changing page width. The panel scrolls natively with `data-lenis-prevent`. No additional scroll instance or ScrollTrigger is created. GSAP entrance/exit animation respects reduced motion and is killed on cleanup. A queued native close event cannot clear a freshly reopened dialog's state.

## Verification

Run the focused Chrome suite (set CHROME_BIN to the installed Chrome executable if needed):

    npm.cmd test -- --watch=false --karma-config=karma.header.cjs --browsers=ChromeHeadlessDesktop --include=src/app/layout/header/*.spec.ts

The responsive suite resizes Karma's real browser context frame to 375, 430, 768, 1024 and 1440px. It checks actual media-query visibility, each desktop panel's overflow, mobile destinations and accordion state, short-screen scrolling, keyboard focus, Escape, route selection, active state, resize cleanup, animation/reopening, and preservation of pre-existing scroll styles. SVG rendering and removal of visible question marks are also covered.

Production/SSR build and HTTP smoke checks are included in implementation validation. The project has no lint script. Interactive screenshot review and physical touch-device testing remain unavailable: the browser connector reported no available browser. Automated viewport tests are not a substitute for that visual/device review.

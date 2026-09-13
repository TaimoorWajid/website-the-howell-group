import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';

/** In-memory, per-application state: no browser storage or SSR cross-request state. */
@Injectable({ providedIn: 'root' })
export class ProjectsListingState {
  query = '';
  position: number | null = null;
  restoreRequested = false;

  constructor() {
    const router = inject(Router);
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    router.events.pipe(takeUntilDestroyed(destroyRef)).subscribe(event => {
      if (!(event instanceof NavigationStart)) return;
      const from = router.url.split(/[?#]/)[0];
      const to = event.url.split(/[?#]/)[0];
      if (/^\/projects\/?$/.test(from)) {
        this.position = /^\/projects\/[^/]+\/?$/.test(to) ? document.defaultView?.scrollY ?? 0 : null;
      }
      if (/^\/projects\/?$/.test(to)) {
        this.restoreRequested = /^\/projects\/[^/]+\/?$/.test(from) && this.position !== null;
        if (!this.restoreRequested) this.query = '';
      }
    });
  }
}

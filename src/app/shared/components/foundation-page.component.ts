import { Component, RESPONSE_INIT, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({ selector: 'app-foundation-page', imports: [RouterLink], template: `<section class="foundation-page" aria-labelledby="foundation-title"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1 id="foundation-title">Let’s find your way.</h1><p class="note">This page is no longer available or the address may have changed.</p><a routerLink="/">Return to the homepage →</a></section>`, styles: [`.foundation-page { margin: 0 auto; max-width: var(--content-max-width); padding: clamp(7rem, 16vw, 13rem) var(--page-gutter); } .eyebrow { color: var(--color-teal); font-size: .7rem; letter-spacing: .16em; text-transform: uppercase; } h1 { font-family: var(--font-display); font-size: clamp(2.5rem, 8vw, 6rem); font-weight: 400; letter-spacing: -.04em; margin: 1rem 0; } .note { color: var(--color-muted); max-width: 32rem; } a { color: var(--color-teal); text-underline-offset: .3em; }`] })
export class FoundationPageComponent {
  private readonly route = inject(ActivatedRoute); private readonly seo = inject(SeoService);
  protected readonly title = this.route.snapshot.data['title'] as string ?? 'The Howell Group';
  constructor() {
    const response = inject(RESPONSE_INIT, { optional: true });
    if (response) response.status = 404;
    this.seo.update({ title: this.title, canonicalPath: '/' + this.route.snapshot.url.map(segment => segment.path).join('/'), noIndex: true });
  }
}

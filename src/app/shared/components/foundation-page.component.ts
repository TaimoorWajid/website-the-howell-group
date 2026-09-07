import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({ selector: 'app-foundation-page', template: `<section class="foundation-page" aria-labelledby="foundation-title"><p class="eyebrow">Foundation route</p><h1 id="foundation-title">{{ title }}</h1><p class="note">Page composition is intentionally reserved for the next implementation phase.</p></section>`, styles: [`.foundation-page { margin: 0 auto; max-width: var(--content-max-width); padding: clamp(7rem, 16vw, 13rem) var(--page-gutter); } .eyebrow { color: var(--color-teal); font-size: .7rem; letter-spacing: .16em; text-transform: uppercase; } h1 { font-family: var(--font-display); font-size: clamp(2.5rem, 8vw, 6rem); font-weight: 400; letter-spacing: -.04em; margin: 1rem 0; } .note { color: var(--color-muted); max-width: 32rem; }`] })
export class FoundationPageComponent {
  private readonly route = inject(ActivatedRoute); private readonly seo = inject(SeoService);
  protected readonly title = this.route.snapshot.data['title'] as string ?? 'The Howell Group';
  constructor() { this.seo.update({ title: this.title, canonicalPath: this.route.snapshot.url.map(segment => segment.path).join('/') || '/' }); }
}

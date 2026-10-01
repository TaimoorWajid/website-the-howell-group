import { Component, input } from '@angular/core';

// Home links provide the accessible name; this image is not announced twice.
@Component({
  selector: 'app-brand-logo',
  host: { '[class.on-dark]': 'onDark()' },
  template: `<img
    src="/images/brand/howell-group-logo-client.png"
    width="1200"
    height="273"
    alt=""
    decoding="async"
  />`,
  styles: [
    `
      :host {
        display: block;
        width: var(--brand-logo-width, 14rem);
        max-width: 100%;
        padding: 0.4rem 0.6rem;
        border-radius: 2px;
      }
      :host(.on-dark) {
        background: var(--color-white);
      }
      img {
        display: block;
        width: 100%;
        height: auto;
      }
    `,
  ],
})
export class BrandLogoComponent {
  readonly onDark = input(false);
}

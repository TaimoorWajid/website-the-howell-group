import { Component } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({ selector: 'app-home-intro', imports: [RevealDirective], template: `<section class="intro section-shell" aria-labelledby="intro-title"><p class="section-label" appReveal>02 / Positioning</p><div class="intro-content"><h2 id="intro-title" appReveal>We make the complex feel <em>considered.</em></h2><div class="intro-copy" appReveal><p>Howell Group brings clarity to ambitious places. We align vision, detail and delivery to create work that feels inevitable when it is complete.</p><p class="muted">A considered approach from first conversation to final handover.</p></div></div></section>`, styles: [`
    .intro { padding-bottom: clamp(8rem, 16vw, 16rem); padding-top: clamp(7rem, 15vw, 14rem); }
    .section-shell { margin: 0 auto; max-width: var(--content-max-width); padding-left: var(--page-gutter); padding-right: var(--page-gutter); }
    .section-label { color: var(--color-teal); font-size: .68rem; letter-spacing: .15em; margin: 0; text-transform: uppercase; }
    .intro-content { display: grid; gap: 8vw; grid-template-columns: minmax(0, 1.35fr) minmax(15rem, .65fr); margin-left: 16%; margin-top: 4rem; }
    h2 { font-size: clamp(3rem, 7vw, 7.5rem); letter-spacing: -.07em; line-height: .9; margin: 0; max-width: 9ch; }
    h2 em { color: var(--color-teal); font-style: normal; }
    .intro-copy { align-self: end; font-size: clamp(1.05rem, 1.6vw, 1.4rem); line-height: 1.45; max-width: 25rem; }
    .intro-copy p { margin: 0 0 2rem; } .intro-copy .muted { color: var(--color-muted); font-size: .85rem; line-height: 1.6; }
    @media (max-width: 48rem) { .intro-content { display: block; margin-left: 0; } .intro-copy { margin-top: 3rem; } }
  `] })
export class HomeIntroComponent {}

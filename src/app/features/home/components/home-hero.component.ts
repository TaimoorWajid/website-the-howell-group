import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../../core/animations/animation.util';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-home-hero', imports: [RouterLink, RevealDirective],
  template: `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow" appReveal>Howell Group <span aria-hidden="true">/</span> Built with intent</p>
      <h1 id="hero-title" class="hero-title">Building<br /><em>what matters.</em></h1>
      <p class="hero-lede" appReveal>Considered construction, development and project leadership for places made to last.</p>
      <div class="hero-actions" appReveal><a class="button button--solid" routerLink="/projects">Explore our work <span aria-hidden="true">↗</span></a><a class="text-link" routerLink="/services">Our capabilities <span aria-hidden="true">↓</span></a></div>
    </div>
    <div class="hero-visual" aria-label="Abstract architectural line study" role="img">
      <div class="visual-grid"></div><div class="visual-frame visual-frame--outer"></div><div class="visual-frame visual-frame--inner"></div><div class="visual-line visual-line--vertical"></div><div class="visual-line visual-line--horizontal"></div><span class="visual-mark visual-mark--teal"></span><span class="visual-mark visual-mark--red"></span>
      <p class="visual-caption">A study in structure<br />and proportion</p>
    </div>
    <div class="hero-index" aria-hidden="true"><span>01</span><span class="hero-index-line"></span><span>07</span></div>
  </section>`,
  styles: [`
    :host { display: block; }
    .hero { min-height: calc(100svh - 4.5rem); overflow: hidden; padding: clamp(3rem, 8vw, 8rem) var(--page-gutter) clamp(2.5rem, 5vw, 5rem); position: relative; }
    .hero-copy { max-width: 55rem; position: relative; z-index: 2; }
    .eyebrow, .visual-caption { color: var(--color-teal); font-size: .68rem; letter-spacing: .16em; line-height: 1.5; margin: 0; text-transform: uppercase; }
    .eyebrow span { color: var(--color-red); margin: 0 .5rem; }
    .hero-title { color: var(--color-charcoal); font-size: clamp(4rem, 11vw, 10.5rem); font-weight: 400; letter-spacing: -.075em; line-height: .86; margin: clamp(3rem, 8vw, 7rem) 0 2.5rem; max-width: 10ch; }
    .hero-title em { color: var(--color-teal); font-style: normal; }
    .hero-lede { font-size: clamp(1rem, 1.5vw, 1.3rem); line-height: 1.45; margin: 0 0 2rem; max-width: 25rem; }
    .hero-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 2rem; }
    .button { align-items: center; display: inline-flex; gap: 1.5rem; justify-content: space-between; letter-spacing: .12em; min-width: 12rem; padding: .95rem 1.1rem; text-decoration: none; text-transform: uppercase; }
    .button--solid { background: var(--color-charcoal); color: var(--color-white); }
    .button--solid:hover { background: var(--color-teal); }
    .text-link { border-bottom: 1px solid var(--color-charcoal); color: var(--color-charcoal); font-size: .7rem; letter-spacing: .13em; padding-bottom: .35rem; text-decoration: none; text-transform: uppercase; }
    .hero-visual { background: var(--color-dark-teal); height: min(62vw, 45rem); max-height: 75vh; max-width: 41rem; min-height: 25rem; overflow: hidden; position: absolute; right: var(--page-gutter); top: clamp(4rem, 10vw, 9rem); width: 42vw; }
    .visual-grid { background-image: linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px); background-size: 12% 12%; inset: 0; position: absolute; }
    .visual-frame { border: 1px solid rgba(255,255,255,.5); inset: 13%; position: absolute; transform: rotate(-8deg); }
    .visual-frame--inner { inset: 28% 22%; opacity: .5; transform: rotate(14deg); }
    .visual-line { background: rgba(255,255,255,.55); position: absolute; }
    .visual-line--vertical { height: 120%; left: 51%; top: -10%; transform: rotate(18deg); width: 1px; }
    .visual-line--horizontal { height: 1px; left: -10%; top: 54%; transform: rotate(-12deg); width: 120%; }
    .visual-mark { height: .55rem; position: absolute; width: .55rem; }
    .visual-mark--teal { background: var(--color-teal); left: 16%; top: 20%; }
    .visual-mark--red { background: var(--color-red); bottom: 15%; right: 17%; }
    .visual-caption { bottom: 1.25rem; color: var(--color-white); left: 1.25rem; position: absolute; }
    .hero-index { align-items: center; bottom: 4rem; display: flex; gap: .75rem; position: absolute; right: var(--page-gutter); writing-mode: vertical-rl; }
    .hero-index span { color: var(--color-muted); font-size: .65rem; letter-spacing: .1em; }
    .hero-index-line { background: var(--color-red); height: 3rem; width: 1px; }
    @media (max-width: 60rem) { .hero-visual { opacity: .22; right: -8rem; width: 68vw; } .hero-title { max-width: 8ch; } }
    @media (max-width: 48rem) { .hero { min-height: calc(100svh - 4rem); padding-top: 3rem; } .hero-visual { bottom: 0; height: 55vh; opacity: .18; right: -5rem; top: auto; width: 95vw; } .hero-title { font-size: clamp(3.8rem, 18vw, 6rem); margin-top: 5rem; } .hero-index { bottom: 2rem; } }
    @media (prefers-reduced-motion: reduce) { .hero-visual { opacity: .12; } }
  `]
})
export class HomeHeroComponent implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationManagerService);
  private context: gsap.Context | null = null;
  ngAfterViewInit(): void { if (prefersReducedMotion()) return; this.context = this.animations.createContext(this.element.nativeElement, () => { gsap.from('.hero-title', { autoAlpha: 0, y: 42, duration: 1.1, delay: .15, ease: 'power3.out' }); }); }
  ngOnDestroy(): void { this.context?.revert(); }
}

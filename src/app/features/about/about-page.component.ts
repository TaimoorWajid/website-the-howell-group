import { afterNextRender, Component, computed, ElementRef, inject, NgZone, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { SeoService } from '../../core/services/seo.service';
import { PerspectiveAlignmentComponent } from './perspective-alignment.component';
import { ABOUT_VALUES } from './about.data';

@Component({ selector: 'app-about-page', imports: [RouterLink, PerspectiveAlignmentComponent], templateUrl: './about-page.component.html', styleUrl: './about-page.component.scss' })
export class AboutPageComponent implements OnDestroy {
  readonly values = ABOUT_VALUES;
  readonly selectedValue = signal(2);
  readonly hoveredValue = signal<number | null>(null);
  readonly displayedValue = computed(() => this.hoveredValue() ?? this.selectedValue());
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private readonly scrolling = inject(SmoothScrollService);
  private readonly zone = inject(NgZone);
  private media?: gsap.MatchMedia;

  constructor() {
    inject(SeoService).update({ title: 'About | The Howell Group', description: "Built around people. United by purpose. We bring people, perspective and project leadership together around the owner's mission.", canonicalPath: '/about' });
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      this.animations.setup(); this.media = gsap.matchMedia();
      this.media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 48rem)' }, context => {
        if (!context.conditions!['motion']) return;
        const root = this.host.nativeElement;
        const palette = getComputedStyle(root);
        const select = (selector: string): Element | null => root.querySelector(selector);
        const hero = select('.about-hero');
        try {
          gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from(select('.hero-eyebrow'), { opacity: 0, y: 8, duration: .5 }, 0)
            .from(root.querySelectorAll('.hero-line > span'), { yPercent: 110, duration: .9, stagger: .12 }, .12)
            .from(root.querySelectorAll('.hero-body, .discover-link'), { opacity: 0, y: 10, duration: .6, stagger: .1 }, .5);
          gsap.to(select('.hero-image-mask'), { clipPath: 'inset(5% 4% 7% 4%)', ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .5 } });
          gsap.fromTo(select('.hero-photo'), { scale: 1.045 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .5 } });
          root.querySelectorAll('.purpose-phrase').forEach(phrase => gsap.fromTo(phrase, { color: palette.getPropertyValue('--color-muted').trim() }, { color: palette.getPropertyValue('--color-teal').trim(), ease: 'none', scrollTrigger: { trigger: phrase, start: 'top 78%', end: 'top 42%', scrub: .3 } }));
          gsap.timeline({ scrollTrigger: { trigger: select('.founders'), start: 'top 78%', once: true } })
            .from(select('.portrait--marc'), { clipPath: 'inset(0 100% 0 0)', y: 12, duration: 1, ease: 'power3.out' }, 0)
            .from(select('.portrait--eric'), { clipPath: 'inset(0 0 0 100%)', y: 12, duration: 1, ease: 'power3.out' }, .15);
          gsap.from(root.querySelectorAll('.essay-mask'), { clipPath: 'inset(100% 0 0 0)', duration: 1, stagger: .13, ease: 'power3.out', scrollTrigger: { trigger: select('.photo-essay'), start: 'top 80%', once: true } });
          gsap.to(select('.together-word'), { color: 'rgba(182,216,207,.16)', duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: select('.about-closing'), start: 'top 85%', once: true } });
          if (context.conditions!['desktop']) {
            gsap.fromTo(select('.purpose-image'), { y: 14 }, { y: -14, ease: 'none', scrollTrigger: { trigger: select('.purpose'), start: 'top bottom', end: 'bottom top', scrub: .5 } });
            root.querySelectorAll('.essay-image').forEach((image, index) => gsap.fromTo(image, { yPercent: 2 + index }, { yPercent: -2 - index, ease: 'none', scrollTrigger: { trigger: select('.photo-essay'), start: 'top bottom', end: 'bottom top', scrub: .5 } }));
          }
        } catch {
          // A failed enhancement must never leave semantic copy hidden.
          context.revert();
        }
      });
    }));
  }

  discover(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return;
    const target = this.host.nativeElement.querySelector<HTMLElement>('#about-purpose');
    if (!target) return;
    event.preventDefault();
    if (prefersReducedMotion()) target.scrollIntoView({ behavior: 'instant' });
    else this.scrolling.scrollTo('#about-purpose');
    target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    history.replaceState(history.state, '', '#about-purpose');
  }

  selectValue(index: number): void { this.selectedValue.set(index); this.hoveredValue.set(null); }
  previewValue(event: PointerEvent, index: number): void { if (event.pointerType === 'mouse') this.hoveredValue.set(index); }
  ngOnDestroy(): void { this.media?.revert(); }
}

import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, NgZone, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { SERVICE_CHAPTERS } from './services.data';

@Component({ selector: 'app-service-story', imports: [RouterLink], templateUrl: './service-story.component.html', styleUrl: './service-story.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ServiceStoryComponent implements OnDestroy {
  readonly chapters = SERVICE_CHAPTERS;
  readonly active = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private readonly scroll = inject(SmoothScrollService);
  private readonly zone = inject(NgZone);
  private media?: gsap.MatchMedia;
  private resize?: ResizeObserver;
  private imageTween?: gsap.core.Timeline;
  private images: HTMLElement[] = [];
  private animateImages = false;
  private headerOffset = 0;
  private navHeight = 0;

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      const root = this.host.nativeElement;
      const nav = root.querySelector<HTMLElement>('.service-nav')!;
      const header = document.querySelector<HTMLElement>('app-header');
      const measure = (): void => {
        // The current header is in normal flow. Reserve its measured height only
        // if it is actually sticky/fixed, rather than leaving a phantom gap.
        const bar = header?.querySelector<HTMLElement>('.site-header');
        const fixed = [header, bar].some(element => element && ['fixed', 'sticky'].includes(getComputedStyle(element).position));
        this.headerOffset = fixed ? header?.getBoundingClientRect().height ?? 0 : 0;
        this.navHeight = nav.getBoundingClientRect().height;
        root.style.setProperty('--story-header', `${this.headerOffset}px`);
        root.style.setProperty('--story-nav-height', `${this.navHeight}px`);
      };
      this.resize = new ResizeObserver(measure); this.resize.observe(nav); if (header) this.resize.observe(header); measure();
      this.animations.setup();
      this.images = Array.from(root.querySelectorAll<HTMLElement>('.story-image'));
      this.media = gsap.matchMedia();
      this.media.add({ desktop: '(min-width: 48rem)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
        this.animateImages = !!context.conditions!['desktop'] && !!context.conditions!['motion'];
        const chapters = Array.from(root.querySelectorAll<HTMLElement>('.service-chapter'));
        // One trigger computes the reading position in either direction. Angular
        // only receives updates when a chapter boundary is crossed.
        ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onUpdate: () => {
          const line = this.headerOffset + this.navHeight + Math.max(80, (window.innerHeight - this.navHeight) * .3);
          let index = 0;
          chapters.forEach((chapter, i) => { if (chapter.getBoundingClientRect().top <= line) index = i; });
          this.select(index);
        } });
        this.animations.refresh();
        return () => { this.imageTween?.kill(); gsap.set(this.images, { clearProps: 'opacity,clipPath,zIndex' }); };
      });
    }));
  }
  private select(index: number): void {
    if (this.active() === index) return;
    const previous = this.active(); this.active.set(index);
    if (!this.animateImages) return;
    this.imageTween?.kill();
    gsap.set(this.images, { opacity: 0, zIndex: 0, clipPath: 'inset(0)' });
    gsap.set(this.images[previous], { opacity: 1, zIndex: 1 });
    gsap.set(this.images[index], { zIndex: 2 });
    this.imageTween = gsap.timeline()
      .fromTo(this.images[index], { opacity: 0, clipPath: index > previous ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)' }, { opacity: 1, clipPath: 'inset(0)', duration: .65, ease: 'power2.out' })
      .to(this.images[previous], { opacity: 0, duration: .5 }, 0);
  }
  goTo(event: MouseEvent, id: string): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = this.host.nativeElement.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    event.preventDefault();
    const nav = this.host.nativeElement.querySelector<HTMLElement>('.service-nav')!;
    const obstruction = getComputedStyle(nav).position === 'sticky' ? this.headerOffset + this.navHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - obstruction - 24;
    if (prefersReducedMotion()) window.scrollTo({ top: y, behavior: 'instant' });
    else this.scroll.scrollTo(y);
    target.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
    history.replaceState(history.state, '', `#${id}`);
  }
  ngOnDestroy(): void { this.imageTween?.kill(); this.media?.revert(); this.resize?.disconnect(); }
}

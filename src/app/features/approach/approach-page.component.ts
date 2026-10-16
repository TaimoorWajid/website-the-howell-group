import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { SeoService } from '../../core/services/seo.service';
import { APPROACH_PHASES } from './approach.data';

@Component({
  selector: 'app-approach-page',
  imports: [RouterLink],
  templateUrl: './approach-page.component.html',
  styleUrl: './approach-page.component.scss',
})
export class ApproachPageComponent implements OnDestroy {
  protected readonly phases = APPROACH_PHASES;
  protected readonly active = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private readonly scroll = inject(SmoothScrollService);
  private headerOffset = 0;
  private cleanup?: () => void;

  constructor() {
    inject(SeoService).update({
      title: 'Our Approach | The Howell Group',
      description:
        'Your mission guides every phase. Explore Howell’s eight-phase project lifecycle, from project development through operation and patient readiness.',
      canonicalPath: '/our-approach',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Our Approach', path: '/our-approach' },
      ],
    });
    afterNextRender(() => {
      const root = this.host.nativeElement;
      const phases = Array.from(root.querySelectorAll<HTMLElement>('.phase'));
      const header = document.querySelector<HTMLElement>('app-header');
      const bar = header?.querySelector<HTMLElement>('.site-header');
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let frame = 0;
      const update = (): void => {
        frame = 0;
        this.measureHeader();
        const readingLine =
          this.headerOffset + Math.min(180, window.innerHeight * 0.25);
        let index = 0;
        phases.forEach((phase, i) => {
          if (phase.getBoundingClientRect().top <= readingLine) index = i;
        });
        this.active.set(index);
        const first = phases[0].getBoundingClientRect().top;
        const last = phases[phases.length - 1].getBoundingClientRect().top;
        const progress = Math.max(
          0,
          Math.min(1, (readingLine - first) / Math.max(1, last - first)),
        );
        root.style.setProperty(
          '--phase-progress',
          String(prefersReducedMotion() ? 1 : progress),
        );
      };
      const schedule = (): void => {
        if (!frame) frame = window.requestAnimationFrame(update);
      };
      const resize = new ResizeObserver(schedule);
      resize.observe(root);
      if (header) resize.observe(header);
      if (bar) resize.observe(bar);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      motion.addEventListener('change', schedule);
      update();
      const media = gsap.matchMedia();
      const context = this.animations.createContext(root, () => {
        media.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.from(root.querySelectorAll('.hero h1, .hero-intro'), {
            opacity: 0,
            y: 16,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
          });
        });
      });
      this.cleanup = () => {
        window.cancelAnimationFrame(frame);
        resize.disconnect();
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        motion.removeEventListener('change', schedule);
        media.revert();
        context?.revert();
      };
    });
  }

  private measureHeader(): void {
    const header = document.querySelector<HTMLElement>('app-header');
    const bar = header?.querySelector<HTMLElement>('.site-header');
    this.headerOffset = Math.max(
      0,
      ...[header, bar].map((element) => {
        if (
          !element ||
          !['fixed', 'sticky'].includes(getComputedStyle(element).position)
        )
          return 0;
        return Math.max(0, element.getBoundingClientRect().bottom);
      }),
    );
    this.host.nativeElement.style.setProperty(
      '--approach-header',
      `${this.headerOffset}px`,
    );
  }

  protected goToPhase(event: MouseEvent, id: string): void {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = this.host.nativeElement.querySelector<HTMLElement>('#' + id);
    if (!target) return;
    event.preventDefault();
    this.measureHeader();
    // Normal immediate scrolling; no pinning, scroll hijacking or animated jump.
    this.scroll.restorePosition(
      window.scrollY +
        target.getBoundingClientRect().top -
        this.headerOffset -
        24,
    );
    target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    history.replaceState(history.state, '', '#' + id);
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

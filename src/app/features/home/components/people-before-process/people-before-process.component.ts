import { afterNextRender, Component, ElementRef, inject, NgZone, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../../../core/animations/animation.util';

@Component({
  selector: 'app-people-before-process', imports: [RouterLink],
  templateUrl: './people-before-process.component.html', styleUrl: './people-before-process.component.scss'
})
export class PeopleBeforeProcessComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private readonly zone = inject(NgZone);
  private context: gsap.Context | null = null;
  private trigger?: ScrollTrigger;
  private motion?: MediaQueryList;
  private readonly motionChanged = (): void => { if (this.motion?.matches) this.revealImmediately(); };

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.motion.addEventListener('change', this.motionChanged);
      if (prefersReducedMotion()) return;
      try {
        this.animations.createContext(this.host.nativeElement, context => {
          this.context = context;
          const splitHeading = window.matchMedia('(min-width: 48rem)').matches;
          const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
            .from('.people-image-mask', { clipPath: 'inset(0 0 0 100%)', duration: 1.15 }, 0)
            .from('.people-image', { scale: 1.04, duration: 1.35 }, 0)
            .from('.people-eyebrow', { opacity: 0, y: 8, duration: .4 }, .12)
            .from(splitHeading ? '.heading-mask > span' : 'h2', { yPercent: splitHeading ? 105 : 0, y: splitHeading ? 0 : 12, opacity: 0, duration: .65, stagger: .1 }, .25)
            .from('.people-body', { opacity: 0, y: 10, duration: .5 }, .55)
            .from('.people-link, .founder-line', { opacity: 0, y: 8, duration: .4, stagger: .12 }, .85);
          this.trigger = ScrollTrigger.create({ trigger: this.host.nativeElement, animation: timeline, start: 'top 80%', once: true, toggleActions: 'play none none none' });
        });
      } catch { this.revealImmediately(); }
    }));
  }
  protected revealImmediately(): void {
    this.trigger?.kill();
    this.context?.revert();
    this.context = null;
  }
  ngOnDestroy(): void {
    this.revealImmediately();
    this.motion?.removeEventListener('change', this.motionChanged);
  }
}

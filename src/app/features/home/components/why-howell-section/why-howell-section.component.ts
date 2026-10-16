import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../../../core/animations/animation.util';

@Component({
  selector: 'app-why-howell-section',
  imports: [RouterLink],
  templateUrl: './why-howell-section.component.html',
  styleUrl: './why-howell-section.component.scss',
})
export class WhyHowellSectionComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private context: gsap.Context | null = null;
  private timeline?: gsap.core.Timeline;
  private trigger?: ScrollTrigger;
  private motion?: MediaQueryList;
  private readonly motionChanged = (): void => {
    // Returning to normal motion does not replay an already exposed section.
    if (this.motion?.matches) this.revealImmediately();
  };

  constructor() {
    afterNextRender(() => {
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.motion.addEventListener('change', this.motionChanged);
      if (prefersReducedMotion()) return;
      try {
        this.animations.createContext(this.host.nativeElement, (context) => {
          // Save the context before building so even partial setup can be reverted.
          this.context = context;
          this.timeline = gsap
            .timeline({ paused: true, defaults: { ease: 'power3.out' } })
            .from('.why-grid', { opacity: 0, scale: 1.08, duration: 1.2 }, 0)
            .from(
              '.drawing-path',
              { strokeDashoffset: 1, duration: 0.95, stagger: 0.08 },
              0.08,
            )
            .from('.why-index', { opacity: 0, y: -8, duration: 0.4 }, 0.12)
            .from('.why-eyebrow', { opacity: 0, y: 8, duration: 0.4 }, 0.16)
            .from(
              '.heading-mask > span',
              { yPercent: 105, opacity: 0.15, duration: 0.65, stagger: 0.1 },
              0.28,
            )
            .from(
              '.body-mask > span',
              { yPercent: 105, opacity: 0, duration: 0.5, stagger: 0.08 },
              0.58,
            )
            .from(
              '.standard-label, .standard-rule, .standard-list li, .standard-note',
              { opacity: 0, y: 12, duration: 0.45, stagger: 0.08 },
              0.58,
            )
            .from('.why-link', { opacity: 0, y: 8, duration: 0.4 }, 1.02)
            .from('.why-arrow', { x: -3, opacity: 0, duration: 0.3 }, 1.12);
          this.trigger = ScrollTrigger.create({
            trigger: this.host.nativeElement,
            animation: this.timeline,
            start: 'top 76%',
            once: true,
            toggleActions: 'play none none none',
          });
        });
      } catch {
        this.revealImmediately();
      }
    });
  }

  protected revealImmediately(): void {
    this.trigger?.kill();
    this.context?.revert();
    this.context = null;
    this.timeline = undefined;
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.context?.revert();
    this.motion?.removeEventListener('change', this.motionChanged);
  }
}

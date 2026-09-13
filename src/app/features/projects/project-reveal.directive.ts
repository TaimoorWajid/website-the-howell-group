import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';

@Directive({ selector: '[appProjectReveal]' })
export class ProjectRevealDirective implements AfterViewInit, OnDestroy {
  readonly appProjectReveal = input(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private observer?: IntersectionObserver;
  private context: gsap.Context | null = null;

  ngAfterViewInit(): void {
    // Elements stay visible until entry, including SSR and failed initialization.
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;
    try {
      this.observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        this.observer?.disconnect();
        if (prefersReducedMotion()) return;
        try {
          this.context = this.animations.createContext(this.host.nativeElement, () => {
            const timeline = gsap.timeline({ delay: (this.appProjectReveal() % 2) * .07 });
            const media = this.host.nativeElement.querySelector('.project-media');
            const copy = this.host.nativeElement.querySelectorAll('[data-card-copy]');
            if (media) timeline.fromTo(media,
                { clipPath: 'inset(0 0 10% 0)' },
                { clipPath: 'inset(0 0 0% 0)', duration: .75, ease: 'power2.out', clearProps: 'clipPath' });
            if (copy.length) timeline.fromTo(copy,
                { y: 10, opacity: .65 },
                { y: 0, opacity: 1, duration: .55, stagger: .08, ease: 'power2.out', clearProps: 'transform,opacity' }, .1);
          });
        } catch { this.clearAnimation(); }
      }, { threshold: .08 });
      this.observer.observe(this.host.nativeElement);
    } catch { this.clearAnimation(); }
  }

  private clearAnimation(): void {
    this.context?.revert();
    this.host.nativeElement.querySelectorAll<HTMLElement>('.project-media, [data-card-copy]').forEach(element => {
      element.style.removeProperty('clip-path');
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    });
  }

  ngOnDestroy(): void { this.observer?.disconnect(); this.context?.revert(); }
}

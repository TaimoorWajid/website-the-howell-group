import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';

@Directive({ selector: '[appReveal]' })
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationManagerService);
  private context: gsap.Context | null = null;

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;
    this.context = this.animations.createContext(this.element.nativeElement, () => {
      gsap.fromTo(this.element.nativeElement,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: this.element.nativeElement, start: 'top 88%', once: true } }
      );
    });
  }

  ngOnDestroy(): void { this.context?.revert(); }
}

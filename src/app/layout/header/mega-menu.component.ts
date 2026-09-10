import { AfterViewInit, Component, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { NavigationIconComponent } from './navigation-icon.component';
import { MegaMenuConfig } from './mega-menu.types';

@Component({ selector: 'app-mega-menu', imports: [RouterLink, RouterLinkActive, NavigationIconComponent], templateUrl: './mega-menu.component.html', styleUrl: './mega-menu.component.scss' })
export class MegaMenuComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) config!: MegaMenuConfig;
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private context: gsap.Context | null = null;
  private exitTween?: gsap.core.Tween;
  ngAfterViewInit(): void {
    this.context = this.animations.createContext(this.element.nativeElement, () => {
      if (prefersReducedMotion()) return;
      gsap.timeline().from(this.element.nativeElement, { opacity: 0, y: -8, duration: .3, ease: 'power2.out' })
        .from('.menu-section, .feature', { opacity: 0, y: 10, duration: .32, stagger: .045, ease: 'power2.out' }, .08);
    });
  }
  cancelClose(): void { this.exitTween?.kill(); gsap.set(this.element.nativeElement, { clearProps: "opacity,transform" }); }
  close(done: () => void): void {
    this.context?.revert();
    if (prefersReducedMotion()) { done(); return; }
    this.exitTween = gsap.to(this.element.nativeElement, { opacity: 0, y: -6, duration: .18, ease: 'power2.in', onComplete: done });
  }
  ngOnDestroy(): void { this.exitTween?.kill(); this.context?.revert(); }
}

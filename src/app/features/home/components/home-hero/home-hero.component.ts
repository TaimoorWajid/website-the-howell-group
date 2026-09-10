import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, OnDestroy, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';
import { HomeHeroThreeComponent } from '../home-hero-three/home-hero-three.component';

@Component({
  selector: 'app-home-hero', imports: [RouterLink, HomeHeroThreeComponent],
  templateUrl: './home-hero.component.html', styleUrl: './home-hero.component.scss'
})
export class HomeHeroComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly animations = inject(AnimationManagerService);
  private context?: gsap.Context | null;
  private headerObserver?: ResizeObserver;
  private motion?: MediaQueryList;
  private readonly motionChanged = (): void => { if (this.motion?.matches) this.context?.revert(); };

  constructor() {
    afterNextRender(() => {
      const header = this.document.querySelector<HTMLElement>('app-header .site-header');
      if (header) {
        const measure = (): void => this.host.nativeElement.style.setProperty('--hero-header-height', `${header.getBoundingClientRect().height}px`);
        measure();
        this.headerObserver = new ResizeObserver(measure);
        this.headerObserver.observe(header);
      }
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.motion.addEventListener('change', this.motionChanged);
      if (this.motion.matches) return;
      this.context = this.animations.createContext(this.host.nativeElement, () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-eyebrow', { opacity: 0, y: 6, duration: .45 }, 0)
          .from('.heading-line > span', { yPercent: 105, duration: .75, stagger: .1 }, .08)
          .from('.hero-lede', { opacity: 0, y: 10, duration: .55 }, .32)
          .from('.hero-link', { opacity: 0, y: 8, duration: .45, stagger: .07 }, .45);
      });
    });
  }

  ngOnDestroy(): void { this.context?.revert(); this.headerObserver?.disconnect(); this.motion?.removeEventListener('change', this.motionChanged); }
}

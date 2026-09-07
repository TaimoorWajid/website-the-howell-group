import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private lenis: Lenis | null = null;
  private readonly tick = (time: number): void => { this.lenis?.raf(time * 1000); };

  initialize(): void {
    if (!isPlatformBrowser(this.platformId) || this.lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.lenis = new Lenis({ autoRaf: false, smoothWheel: true });
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(this.tick);
    gsap.ticker.lagSmoothing(0);
  }

  stop(): void { this.lenis?.stop(); }
  start(): void { this.lenis?.start(); }
  scrollTo(target: string | number): void { this.lenis?.scrollTo(target); }

  destroy(): void {
    if (!this.lenis) return;
    this.lenis.off('scroll', ScrollTrigger.update);
    gsap.ticker.remove(this.tick);
    this.lenis.destroy();
    this.lenis = null;
  }
}

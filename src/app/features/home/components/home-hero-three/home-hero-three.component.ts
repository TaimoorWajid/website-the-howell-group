import { Component, ElementRef, Injector, OnDestroy, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import type { HeroSceneController } from './hero-scene.controller';

@Component({ selector: 'app-home-hero-three', templateUrl: './home-hero-three.component.html', styleUrl: './home-hero-three.component.scss' })
export class HomeHeroThreeComponent implements OnDestroy {
  @ViewChild('stage', { static: true }) private stage!: ElementRef<HTMLElement>;
  private readonly injector = inject(Injector);
  protected readonly ready = signal(false);
  private controller?: HeroSceneController;
  private motion?: MediaQueryList;
  private mobile?: MediaQueryList;
  private frame: number | null = null;
  private generation = 0;
  private destroyed = false;
  private readonly modeChanged = (): void => { this.reset(); this.schedule(); };

  constructor() {
    afterNextRender(() => {
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.mobile = window.matchMedia('(max-width: 48rem)');
      this.motion.addEventListener('change', this.modeChanged);
      this.mobile.addEventListener('change', this.modeChanged);
      this.schedule();
    });
  }
  private schedule(): void {
    // SSR, mobile, reduced motion and data-saving devices retain the same composed
    // SVG. No WebGL bundle is requested until after essential content has painted.
    const capability = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (this.destroyed || this.motion?.matches || this.mobile?.matches || capability.connection?.saveData || (capability.deviceMemory !== undefined && capability.deviceMemory <= 2)) return;
    const generation = this.generation;
    const started = performance.now();
    this.frame = requestAnimationFrame(() => {
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        void import('./hero-scene.controller').then(({ HeroSceneController }) => {
          if (this.destroyed || generation !== this.generation) return;
          try {
            this.controller = new HeroSceneController(this.stage.nativeElement, this.injector, ready => this.ready.set(ready));
            this.controller.initialize(performance.now() - started < 800);
          } catch { this.controller?.destroy(); this.ready.set(false); }
        }).catch(() => this.ready.set(false));
      });
    });
  }
  private reset(): void {
    this.generation++;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    this.controller?.destroy(); this.controller = undefined;
    this.ready.set(false);
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.reset();
    this.motion?.removeEventListener('change', this.modeChanged);
    this.mobile?.removeEventListener('change', this.modeChanged);
  }
}

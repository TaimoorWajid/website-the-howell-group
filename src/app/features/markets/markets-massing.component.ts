import { Component, ElementRef, Injector, NgZone, OnDestroy, afterNextRender, effect, inject, input, signal } from '@angular/core';
import type { MarketStudyMode, MarketsMassingScene } from './markets-massing.scene';

@Component({
  selector: 'app-markets-massing',
  template: `<img class="massing-fallback" [class.enhanced]="ready()" [src]="mode() === 'layers' ? '/images/markets/layers.svg' : '/images/markets/massing.svg'" width="800" height="500" alt="" /><div class="massing-canvas" [class.ready]="ready()"></div>`,
  styles: [`:host { display: block; position: relative; min-width: 0; aspect-ratio: 1.5; } .massing-fallback { width: 100%; height: 100%; object-fit: contain; display: block; transition: opacity .35s; } .massing-fallback.enhanced { opacity: 0; } .massing-canvas { position: absolute; inset: 0; opacity: 0; } .massing-canvas.ready { opacity: 1; } .massing-canvas :is(canvas) { display: block; width: 100%; height: 100%; } @media (prefers-reduced-motion: reduce) { .massing-fallback { transition: none; } }`],
  host: { 'aria-hidden': 'true' }
})
export class MarketsMassingComponent implements OnDestroy {
  readonly mode = input<MarketStudyMode>('massing');
  readonly activeLayer = input(0);
  protected readonly ready = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly zone = inject(NgZone);
  private scene?: MarketsMassingScene;
  private cleanup?: () => void;
  private destroyed = false;
  private generation = 0;

  constructor() {
    effect(() => { const active = this.activeLayer(); this.scene?.setLayer(active); });
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      const media = window.matchMedia(this.mode() === 'layers' ? '(min-width: 768px) and (prefers-reduced-motion: no-preference)' : '(prefers-reduced-motion: no-preference) and (pointer: fine)');
      const setup = (): void => {
        const generation = ++this.generation;
        this.scene?.destroy(); this.scene = undefined; this.ready.set(false);
        if (!media.matches || this.destroyed) return;
        void import('./markets-massing.scene').then(({ MarketsMassingScene }) => {
          if (this.destroyed || generation !== this.generation || !media.matches) return;
          const viewport = this.host.nativeElement.querySelector<HTMLElement>('.massing-canvas')!;
          this.scene = new MarketsMassingScene(viewport, this.injector, success => this.ready.set(success), this.mode());
          this.scene.initialize(); this.scene.setLayer(this.activeLayer());
        }).catch(() => this.ready.set(false));
      };
      const point = (event: PointerEvent): void => {
        if (!media.matches || event.pointerType === 'touch') return;
        const rect = this.host.nativeElement.getBoundingClientRect();
        this.scene?.point(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)), Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)));
      };
      const leave = (): void => this.scene?.point(0, 0);
      this.host.nativeElement.addEventListener('pointermove', point, { passive: true });
      this.host.nativeElement.addEventListener('pointerleave', leave);
      media.addEventListener('change', setup); setup();
      this.cleanup = () => { media.removeEventListener('change', setup); this.host.nativeElement.removeEventListener('pointermove', point); this.host.nativeElement.removeEventListener('pointerleave', leave); };
    }));
  }
  ngOnDestroy(): void { this.destroyed = true; this.generation++; this.cleanup?.(); this.scene?.destroy(); }
}


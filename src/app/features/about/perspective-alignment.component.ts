import { afterNextRender, Component, ElementRef, inject, Injector, NgZone, OnDestroy, signal } from '@angular/core';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { ABOUT_PERSPECTIVES } from './about.data';
import type { PerspectiveAlignmentScene } from './perspective-alignment.scene';

@Component({ selector: 'app-perspective-alignment', templateUrl: './perspective-alignment.component.html', styleUrl: './perspective-alignment.component.scss' })
export class PerspectiveAlignmentComponent implements OnDestroy {
  readonly chapters = ABOUT_PERSPECTIVES;
  readonly active = signal(0);
  readonly ready = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly animations = inject(AnimationManagerService);
  private readonly scrolling = inject(SmoothScrollService);
  private readonly zone = inject(NgZone);
  private media?: gsap.MatchMedia;
  private timeline?: gsap.core.Timeline;

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      this.animations.setup(); this.media = gsap.matchMedia();
      this.media.add('(min-width: 64rem) and (min-height: 650px) and (prefers-reduced-motion: no-preference)', () => {
        let disposed = false;
        let scene: PerspectiveAlignmentScene | undefined;
        const root = this.host.nativeElement;
        const viewport = root.querySelector<HTMLElement>('.alignment-viewport')!;
        const state = { progress: 0 };
        const staticMode = (): void => {
          this.ready.set(false); root.classList.remove('is-enhanced');
          this.timeline?.scrollTrigger?.kill(true); this.timeline?.kill(); this.timeline = undefined;
        };
        let visible = false;
        const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; scene?.setVisible(visible); });
        visibility.observe(root);
        // Create the pin while the page initializes so later sections have a stable
        // position before this distant section is reached. Failure restores normal flow.
        root.classList.add('is-enhanced');
        this.timeline = gsap.timeline({ scrollTrigger: { trigger: viewport, start: 'top top', end: () => `+=${window.innerHeight * 1.8}`, pin: true, pinSpacing: true, scrub: .45, anticipatePin: 1, invalidateOnRefresh: true } })
          .to(state, { progress: 1, duration: 3, ease: 'none', onUpdate: () => {
            const index = Math.min(2, Math.floor(state.progress * 3));
            if (index !== this.active()) this.active.set(index);
            scene?.setProgress(state.progress);
          } });
        void import('./perspective-alignment.scene').then(({ PerspectiveAlignmentScene }) => {
          if (disposed) return;
          scene = new PerspectiveAlignmentScene(root.querySelector<HTMLElement>('.alignment-canvas')!, this.injector, success => {
            if (disposed) return;
            if (success) this.ready.set(true); else { staticMode(); this.animations.refresh(); }
          });
          if (scene.initialize()) { scene.setProgress(state.progress); scene.setVisible(visible); }
          else { staticMode(); this.animations.refresh(); }
        }).catch(() => { if (!disposed) { staticMode(); this.animations.refresh(); } });
        this.animations.refresh();
        return () => { disposed = true; visibility.disconnect(); scene?.destroy(); staticMode(); };
      });
    }));
  }
  select(index: number): void {
    const trigger = this.timeline?.scrollTrigger;
    if (trigger) this.scrolling.scrollTo(trigger.start + (trigger.end - trigger.start) * ((index + .15) / 3));
    else {
      this.active.set(index);
      this.host.nativeElement.querySelector<HTMLElement>(`#perspective-${index}`)?.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  }
  ngOnDestroy(): void { this.media?.revert(); }
}

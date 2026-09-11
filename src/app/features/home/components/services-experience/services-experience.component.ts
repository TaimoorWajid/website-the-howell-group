import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Injector, NgZone, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';
import { HOWELL_SERVICE_STAGES, serviceStageIndex } from './services-experience.data';
import type { ServicesBuildingScene } from './services-building-scene';

@Component({ selector: 'app-services-experience', imports: [RouterLink], templateUrl: './services-experience.component.html', styleUrl: './services-experience.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ServicesExperienceComponent {
  readonly services = HOWELL_SERVICE_STAGES;
  readonly activeServiceIndex = signal(0);
  readonly modelReady = signal(false);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private readonly visual = viewChild.required<ElementRef<HTMLElement>>('visual');
  private readonly injector = inject(Injector);
  private readonly zone = inject(NgZone);
  private readonly animations = inject(AnimationManagerService);
  private scene?: ServicesBuildingScene;
  private progress = 0;
  private hover: number | null = null;
  private focus: number | null = null;
  private reduced = true;
  private previewTween?: gsap.core.Tween;
  private readonly presentation = { progress: 0 };
  constructor() {
    const destroy = inject(DestroyRef);
    const render = afterNextRender(() => this.zone.runOutsideAngular(() => {
      this.animations.setup();
      const media = gsap.matchMedia();
      media.add({ desktop: '(min-width: 64rem) and (min-height: 520px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
        const { desktop, motion } = context.conditions!;
        this.reduced = !motion;
        let disposed = false;
        let observer: IntersectionObserver | undefined;
        let visibilityObserver: IntersectionObserver | undefined;
        let rows: IntersectionObserver | undefined;
        let timeline: gsap.core.Timeline | undefined;
        this.progress = 0; this.setActive(0);
        if (motion) {
          const element = this.root().nativeElement;
          gsap.from(element.querySelectorAll('.eyebrow, .heading-line > span, .architectural-visual, .service-row'), { y: 16, opacity: 0, duration: .55, stagger: .07, scrollTrigger: { trigger: element, start: 'top 85%', once: true } });
          const state = { progress: 0 };
          if (desktop && this.viewport().nativeElement.scrollHeight <= window.innerHeight + 1) {
            timeline = gsap.timeline({ scrollTrigger: { trigger: this.viewport().nativeElement, start: 'top top', end: () => `+=${window.innerHeight * 3}`, pin: true, pinSpacing: true, scrub: .45, anticipatePin: 1, invalidateOnRefresh: true } });
            timeline.to(state, { progress: 1, duration: 4, ease: 'none', onUpdate: () => { this.progress = state.progress; this.updatePresentation(); } });
          } else {
            rows = new IntersectionObserver(entries => {
              const entering = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
              if (entering) { this.progress = Number((entering.target as HTMLElement).dataset['stage']) / 4; this.updatePresentation(true); }
            }, { rootMargin: '-20% 0px -35% 0px' });
            element.querySelectorAll('.service-row').forEach(row => rows!.observe(row));
          }
          // Mobile uses the same complete line illustration, without a second WebGL workload.
          if (window.matchMedia('(min-width: 48rem)').matches) {
            let started = false;
            let onScreen = false;
            visibilityObserver = new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; this.scene?.setVisible(onScreen); });
            visibilityObserver.observe(element);
            observer = new IntersectionObserver(entries => {
              const visible = entries[0].isIntersecting;
              if (!visible || started) return;
              started = true;
              void import('./services-building-scene').then(({ ServicesBuildingScene }) => {
                if (disposed) return;
                const scene = new ServicesBuildingScene(this.visual().nativeElement, this.injector, () => { this.modelReady.set(false); timeline?.scrollTrigger?.kill(true); this.animations.refresh(); }, () => this.modelReady.set(true));
                if (scene.initialize()) { this.scene = scene; scene.setProgress(this.progress); scene.setVisible(onScreen); }
                else { timeline?.scrollTrigger?.kill(true); this.animations.refresh(); }
              }).catch(() => { if (!disposed) { timeline?.scrollTrigger?.kill(true); this.animations.refresh(); } });
            }, { rootMargin: '300px 0px' });
            observer.observe(element);
          }
          this.animations.refresh();
        }
        return () => { disposed = true; observer?.disconnect(); visibilityObserver?.disconnect(); rows?.disconnect(); this.previewTween?.kill(); this.scene?.destroy(); this.scene = undefined; this.modelReady.set(false); };
      });
      destroy.onDestroy(() => { media.revert(); });
    }));
    destroy.onDestroy(() => render.destroy());
  }
  preview(index: number | null, kind: 'hover' | 'focus'): void {
    this[kind] = index;
    this.zone.runOutsideAngular(() => this.updatePresentation(true));
  }
  private setActive(index: number): void { if (this.activeServiceIndex() !== index) this.activeServiceIndex.set(index); }
  private updatePresentation(animate = false): void {
    const index = this.focus ?? this.hover;
    this.setActive(index ?? serviceStageIndex(this.progress));
    if (this.reduced) return;
    const target = index === null ? this.progress : index / 4;
    this.previewTween?.kill();
    if (animate) this.previewTween = gsap.to(this.presentation, { progress: target, duration: .35, ease: 'power2.out', onUpdate: () => this.scene?.setProgress(this.presentation.progress) });
    else { this.presentation.progress = target; this.scene?.setProgress(target); }
  }
}

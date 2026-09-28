import { Component, DestroyRef, ElementRef, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PROJECT_PHASES } from '../../../../core/data/company.data';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';
import type { JourneyScene } from './journey-scene';

@Component({
  selector: 'app-project-journey',
  imports: [RouterLink],
  templateUrl: './project-journey.component.html',
  styleUrl: './project-journey.component.scss'
})
export class ProjectJourneyComponent {
  @ViewChild('viewport', { static: true }) private viewport!: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLElement>;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animations = inject(AnimationManagerService);
  private readonly scroll = inject(SmoothScrollService);
  protected readonly enhanced = signal(false);
  protected readonly active = signal(0);
  protected readonly phases = PROJECT_PHASES;
  protected readonly descriptions = [
    'Every great healthcare space begins with a clear purpose. Align the vision, scope and investment around the people it will serve.',
    'Bring the right people to the table. Connect owners, designers and builders through shared priorities and clear responsibilities.',
    'Give the vision form. Connect clinical needs, thoughtful architecture and practical decisions in one coordinated design.',
    'Navigate the path to approval. Coordinate requirements and keep critical decisions moving with clarity.',
    'Plan the work before it begins. Align scope, cost, schedule and logistics to create a strong foundation for delivery.',
    'Bring every detail together. Maintain focus on quality, coordination and the owner’s priorities as the building takes shape.',
    'Make the transition count. Coordinate completion, documentation and training for a confident handover.',
    'A building becomes a place of care. Bring the team, systems and space together for operational readiness.'
  ];
  private scene?: JourneyScene;
  private trigger?: ScrollTrigger;
  private tween?: gsap.core.Tween;
  private state = { progress: 0 };

  constructor() {
    afterNextRender(() => {
      let destroyed = false;
      let generation = 0;
      let observer: IntersectionObserver | undefined;
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const compact = matchMedia('(max-width: 767px), (max-height: 760px)');
      const reset = () => {
        generation++;
        observer?.disconnect();
        this.trigger?.kill(); this.trigger = undefined;
        this.tween?.kill(); this.tween = undefined;
        this.scene?.destroy(); this.scene = undefined;
        this.enhanced.set(false);
        this.viewport.nativeElement.classList.remove('journey--immersive');
      };
      const setup = () => {
        reset();
        const capability = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
        if (motion.matches || compact.matches || capability.connection?.saveData || (capability.deviceMemory ?? 8) <= 2) {
          this.animations.refresh(); return;
        }
        const version = generation;
        observer = new IntersectionObserver(entries => {
          if (!entries.some(entry => entry.isIntersecting)) return;
          observer?.disconnect();
          void import('./journey-scene').then(({ JourneyScene }) => {
            if (destroyed || version !== generation) return;
            try {
              this.scene = new JourneyScene(this.canvas.nativeElement, () => {
                reset(); this.animations.refresh();
              });
              this.enhanced.set(true);
              // Set the class synchronously before ScrollTrigger measures the compact stage.
              this.viewport.nativeElement.classList.add('journey--immersive');
              this.animations.setup();
              this.state.progress = 0;
              this.tween = gsap.to(this.state, {
                progress: 1, ease: 'none', paused: true,
                onUpdate: () => {
                  this.active.set(Math.min(7, Math.floor(this.state.progress * 8)));
                  this.scene?.update(this.state.progress);
                  this.viewport.nativeElement.style.setProperty('--journey-progress', String(this.state.progress));
                }
              });
              this.trigger = ScrollTrigger.create({
                id: 'project-journey', trigger: this.viewport.nativeElement,
                start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 6.4),
                pin: true, scrub: .65, animation: this.tween, anticipatePin: 1,
                invalidateOnRefresh: true
              });
              this.animations.refresh();
            } catch {
              reset();
              this.animations.refresh();
            }
          }).catch(() => { /* The complete phase list remains available if the scene cannot load. */ });
        }, { rootMargin: '1200px 0px' });
        observer.observe(this.host.nativeElement);
      };
      const change = () => setup();
      motion.addEventListener('change', change);
      compact.addEventListener('change', change);
      setup();
      this.destroyRef.onDestroy(() => {
        destroyed = true; reset();
        motion.removeEventListener('change', change);
        compact.removeEventListener('change', change);
      });
    });
  }

  protected goToPhase(index: number): void {
    if (!this.trigger) return;
    // A little inside each chapter avoids rounding across the previous boundary.
    this.scroll.restorePosition(this.trigger.start + (this.trigger.end - this.trigger.start) * ((index + .18) / 8));
  }

  protected skip(): void {
    if (this.trigger) this.scroll.restorePosition(this.trigger.end + this.viewport.nativeElement.offsetHeight);
  }
}

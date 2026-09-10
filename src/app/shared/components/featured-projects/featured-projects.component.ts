import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, inject, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../../core/animations/animation-manager.service';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';
import { FeaturedProject } from './featured-projects.types';

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './featured-projects.component.html',
  styleUrl: './featured-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedProjectsComponent {
  readonly projects = input<readonly FeaturedProject[]>([]);
  readonly headingId = input('projects-title');
  protected readonly active = signal(0);
  protected readonly progress = signal(0);
  protected readonly listMode = signal(false);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private readonly smoothScroll = inject(SmoothScrollService);
  private endPosition = 0;

  constructor() {
    // afterRenderEffect never runs during SSR, and rebuilds only for data/list changes.
    afterRenderEffect(cleanup => {
      const projects = this.projects();
      const list = this.listMode();
      untracked(() => {
        this.active.set(0);
        this.progress.set(0);
        if (!projects.length || !this.animations.setup()) return;
        const root = this.host.nativeElement;
        const stage = root.querySelector<HTMLElement>('.featured__stage')!;
        const cards = gsap.utils.toArray<HTMLElement>('.project', root);
        const media = gsap.matchMedia();
        const context = this.animations.createContext(root, () => {
          media.add({
            motion: '(prefers-reduced-motion: no-preference)',
            compact: '(max-width: 767px)',
            sufficientHeight: '(min-height: 520px)'
          }, match => {
            if (!match.conditions?.['motion'] || !match.conditions['sufficientHeight'] || list || cards.length < 2) return;
            const compact = !!match.conditions['compact'];
            root.classList.add('is-stacked');
            const offset = compact ? 12 : 20;
            cards.forEach((card, index) => gsap.set(card, {
              zIndex: cards.length - index,
              scale: 1 - Math.min(index, 3) * .035,
              y: Math.min(index, 3) * offset,
              rotation: index ? (index % 2 ? 1 : -1) * (compact ? .5 : 1.2) : 0,
              transformOrigin: '50% 90%'
            }));
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: stage, start: 'top top', pin: true, pinSpacing: true,
                end: () => '+=' + Math.round(window.innerHeight * (cards.length - 1) * (compact ? .85 : 1.15)),
                scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
                onRefresh: trigger => { this.endPosition = trigger.end; },
                onUpdate: trigger => {
                  this.progress.set(trigger.progress);
                  this.active.set(activeProjectIndex(trigger.progress, cards.length));
                }
              }
            });
            // A short dwell at either end allows the first/last project to settle.
            timeline.to({}, { duration: .2 });
            for (let index = 0; index < cards.length - 1; index++) {
              const position = .2 + index;
              timeline.to(cards[index], {
                y: () => -window.innerHeight * 1.15,
                xPercent: compact ? -2 : -5,
                rotation: compact ? -2 : -4,
                scale: .92, opacity: 0, duration: 1, ease: 'none'
              }, position);
              for (let next = index + 1; next < cards.length; next++) {
                const depth = Math.min(next - index - 1, 3);
                timeline.to(cards[next], {
                  y: depth * offset, scale: 1 - depth * .035,
                  rotation: depth ? (next % 2 ? 1 : -1) * (compact ? .5 : 1.2) : 0,
                  duration: 1, ease: 'none'
                }, position);
              }
            }
            timeline.to({}, { duration: .2 });
            return () => { root.classList.remove('is-stacked'); };
          });
        });
        this.animations.refresh();
        cleanup(() => {
          media.revert();
          context?.revert();
          root.classList.remove('is-stacked');
        });
      });
    });
  }

  protected skip(): void { this.smoothScroll.scrollTo(this.endPosition + 1); }
  protected number(value: number): string { return String(value).padStart(2, '0'); }
  protected imageFailed(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/images/projects/fallback.svg')) image.src = '/images/projects/fallback.svg';
  }
}

/** Mirrors the timeline's dwell intervals and mid-transition handover. */
export function activeProjectIndex(progress: number, count: number): number {
  return Math.min(Math.max(0, count - 1), Math.max(0, Math.floor(progress * (count - 1 + .4) - .2 + .5)));
}

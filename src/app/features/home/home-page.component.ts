import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { catchError, of } from 'rxjs';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { InsightApiService } from '../../core/api/insight-api.service';
import { ProjectApiService } from '../../core/api/project-api.service';
import { Insight, Project } from '../../core/models/content.models';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ScrollRevealCard, ScrollRevealGridCardsComponent } from '../../shared/components/scroll-reveal-grid-cards/scroll-reveal-grid-cards.component';

interface ServiceItem { name: string; description: string; }

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, RevealDirective, ScrollRevealGridCardsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationManagerService);
  private readonly projectsApi = inject(ProjectApiService);
  private readonly insightsApi = inject(InsightApiService);
  private readonly seo = inject(SeoService);
  private animationContext: gsap.Context | null = null;

  protected readonly projects = signal<ReadonlyArray<Project>>([]);
  protected readonly insights = signal<ReadonlyArray<Insight>>([]);
  protected readonly projectsLoading = signal(true);
  protected readonly insightsLoading = signal(true);
  protected readonly activeService = signal(0);
  protected readonly scrollRevealCards: ReadonlyArray<ScrollRevealCard> = [
    { number: '01', title: 'Material', description: 'The quiet language of concrete, steel, timber and light.', image: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1000&q=85', imageAlt: 'Light across a concrete interior' },
    { number: '02', title: 'Structure', description: 'Precision made visible through line, weight and proportion.', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85', imageAlt: 'Geometric architectural facade' },
    { number: '03', title: 'Context', description: 'Every place begins by listening to what is already there.', image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1000&q=85', imageAlt: 'Architectural structure against an open sky' },
    { number: '04', title: 'Light', description: 'Atmosphere shaped by the movement of the day.', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85', imageAlt: 'Sunlit modern interior' }
  ];
  protected readonly projectPlaceholders: ReadonlyArray<Project> = [
    { id: 'placeholder-01', slug: 'the-built-environment', title: 'The Built Environment', excerpt: 'Temporary editorial project placeholder.', location: 'Coming soon', year: 2026, images: [{ src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85', alt: 'Geometric modern concrete architecture' }] },
    { id: 'placeholder-02', slug: 'between-lines', title: 'Between Lines', excerpt: 'Temporary editorial project placeholder.', location: 'Coming soon', year: 2026, images: [{ src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=85', alt: 'Minimal architectural facade with strong lines' }] },
    { id: 'placeholder-03', slug: 'a-place-to-last', title: 'A Place to Last', excerpt: 'Temporary editorial project placeholder.', location: 'Coming soon', year: 2026, images: [{ src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=85', alt: 'Contemporary home set within a quiet landscape' }] }
  ];
  protected readonly insightPlaceholders: ReadonlyArray<Insight> = [
    { id: 'insight-placeholder-01', slug: 'the-value-of-restraint', title: 'The value of restraint', excerpt: 'Temporary editorial insight placeholder.', date: 'Journal', image: { src: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=85', alt: 'Light and shadow across a concrete interior' } },
    { id: 'insight-placeholder-02', slug: 'material-and-memory', title: 'Material and memory', excerpt: 'Temporary editorial insight placeholder.', date: 'Journal', image: { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85', alt: 'Quiet modern interior with natural materials' } },
    { id: 'insight-placeholder-03', slug: 'the-long-view', title: 'The long view', excerpt: 'Temporary editorial insight placeholder.', date: 'Journal', image: { src: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1000&q=85', alt: 'Architectural structure against an open sky' } }
  ];
  protected readonly serviceItems: ReadonlyArray<ServiceItem> = [
    { name: 'Construction', description: 'Delivery with discipline, from groundworks to handover.' },
    { name: 'Development', description: 'Clear thinking around opportunity, context and long-term value.' },
    { name: 'Design + Build', description: 'A joined-up process where intent survives into detail.' },
    { name: 'Project Management', description: 'Calm, rigorous leadership across every moving part.' },
    { name: 'Advisory', description: 'An experienced perspective when the decisions matter most.' }
  ];

  constructor() {
    this.seo.update({ title: 'Howell Group | Premium Construction & Development', description: 'Howell Group delivers premium construction, development and project leadership for enduring places, from first concept through final detail and handover.', canonicalPath: '/' });
    if (isPlatformBrowser(this.platformId)) this.loadContent();
    else { this.projectsLoading.set(false); this.insightsLoading.set(false); }
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;
    this.animationContext = this.animations.createContext(this.element.nativeElement, () => {
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .fromTo('.hero-visual', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9 }, 0)
        .fromTo('.title-word', { clipPath: 'inset(100% 0 0 0)', yPercent: 18 }, { clipPath: 'inset(0% 0 0 0)', yPercent: 0, duration: 1.05, stagger: .08 }, .1)
        .fromTo('.hero-lede', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .8 }, .72)
        .fromTo('.hero-actions', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .65 }, .92);
    });
  }

  ngOnDestroy(): void { this.animationContext?.revert(); }

  private loadContent(): void {
    this.projectsApi.getProjects().pipe(catchError(() => of([])), takeUntilDestroyed(this.destroyRef)).subscribe(projects => { this.projects.set(projects); this.projectsLoading.set(false); });
    this.insightsApi.getInsights().pipe(catchError(() => of([])), takeUntilDestroyed(this.destroyRef)).subscribe(insights => { this.insights.set(insights); this.insightsLoading.set(false); });
  }
}

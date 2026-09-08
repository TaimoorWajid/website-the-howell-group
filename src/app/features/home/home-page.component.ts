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
import { HomeHeroThreeComponent } from './components/home-hero-three/home-hero-three.component';

interface ServiceItem { name: string; description: string; }

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, RevealDirective, HomeHeroThreeComponent],
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

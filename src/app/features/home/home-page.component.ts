import { ProjectJourneyComponent } from './components/project-journey/project-journey.component';
import { PeopleBeforeProcessComponent } from './components/people-before-process/people-before-process.component';
import { ServicesExperienceComponent } from './components/services-experience/services-experience.component';
import { WhyHowellSectionComponent } from './components/why-howell-section/why-howell-section.component';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { InsightApiService } from '../../core/api/insight-api.service';
import { Insight } from '../../core/models/content.models';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ScrollRevealCard, ScrollRevealGridCardsComponent } from '../../shared/components/scroll-reveal-grid-cards/scroll-reveal-grid-cards.component';
import { FeaturedProjectsComponent } from '../../shared/components/featured-projects/featured-projects.component';
import { PORTFOLIO_PROJECTS } from '../../core/data/projects.data';
import { COMPANY } from '../../core/data/company.data';
import { FeaturedProject } from '../../shared/components/featured-projects/featured-projects.types';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';



@Component({
  selector: 'app-home-page',
  imports: [ProjectJourneyComponent, PeopleBeforeProcessComponent, ServicesExperienceComponent, WhyHowellSectionComponent, HomeHeroComponent, RouterLink, RevealDirective, ScrollRevealGridCardsComponent, FeaturedProjectsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly insightsApi = inject(InsightApiService);
  private readonly seo = inject(SeoService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);


  protected readonly featuredProjects: readonly FeaturedProject[] = PORTFOLIO_PROJECTS.map(project => ({
    id: project.id, title: project.title, route: '/projects/' + project.slug,
    area: project.area,
    bedCount: project.bedCount,
    jurisdiction: project.jurisdiction,
    description: project.overview?.paragraphs.join(' '),
    outcome: project.contribution?.outcome,
    image: project.images[0].src, imageAlt: project.images[0].alt
  }));
  protected readonly insights = signal<ReadonlyArray<Insight>>([]);
  protected readonly insightsLoading = signal(true);
  protected readonly scrollRevealCards: ReadonlyArray<ScrollRevealCard> = [
    { number: '01', title: 'Your mission', description: 'Define the need, scope and priorities before choosing a path forward.', image: '/images/why-howell/concrete-interior.webp', imageAlt: '' },
    { number: '02', title: 'One team', description: 'Align owners, designers and contractors around clear responsibilities and shared goals.', image: '/images/projects/project-02.jpg', imageAlt: '' },
    { number: '03', title: 'Clear decisions', description: 'Connect scope, schedule and cost with the information owners need to make decisions.', image: '/images/projects/project-03.jpg', imageAlt: '' },
    { number: '04', title: 'Patient ready', description: 'Plan for close out, operational training and licensing from the beginning.', image: '/images/projects/project-04.jpg', imageAlt: '' }
  ];

  constructor() {
    afterNextRender(() => {
      // The card runway is expanded by a later Angular render. Pin coordinates
      // measured before that render are stale even though the viewport did not resize.
      let frame: number | undefined;
      const observer = new ResizeObserver(() => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          frame = undefined;
          this.animations.refresh();
        });
      });
      this.host.nativeElement.querySelectorAll('.home-page > *').forEach(section => observer.observe(section, { box: 'border-box' }));
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        if (frame !== undefined) cancelAnimationFrame(frame);
      });
    });
    this.seo.update({ title: COMPANY.name + ' | ' + COMPANY.tagline, description: COMPANY.positioning + ' ' + COMPANY.market, canonicalPath: '/' });
    if (isPlatformBrowser(this.platformId)) this.loadContent();
    else { this.insightsLoading.set(false); }
  }

  private loadContent(): void {
    this.insightsApi.getInsights().pipe(catchError(() => of([])), takeUntilDestroyed(this.destroyRef)).subscribe(insights => { this.insights.set(insights); this.insightsLoading.set(false); });
  }
}

import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Insight, Project } from '../../core/models/content.models';
import { ProjectApiService } from '../../core/api/project-api.service';
import { InsightApiService } from '../../core/api/insight-api.service';
import { SeoService } from '../../core/services/seo.service';
import { HomeAboutComponent } from './components/home-about.component';
import { HomeFeaturedProjectsComponent } from './components/home-featured-projects.component';
import { HomeFinalCtaComponent } from './components/home-final-cta.component';
import { HomeHeroComponent } from './components/home-hero.component';
import { HomeInsightsComponent } from './components/home-insights.component';
import { HomeIntroComponent } from './components/home-intro.component';
import { HomeServicesComponent } from './components/home-services.component';

@Component({
  selector: 'app-home-page',
  imports: [HomeHeroComponent, HomeIntroComponent, HomeFeaturedProjectsComponent, HomeServicesComponent, HomeAboutComponent, HomeInsightsComponent, HomeFinalCtaComponent],
  template: `<div class="home-page"><app-home-hero /><app-home-intro /><app-home-featured-projects [projects]="projects()" [loading]="projectsLoading()" /><app-home-services /><app-home-about /><app-home-insights [insights]="insights()" [loading]="insightsLoading()" /><app-home-final-cta /></div>`
})
export class HomePageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly projectsApi = inject(ProjectApiService);
  private readonly insightsApi = inject(InsightApiService);
  private readonly seo = inject(SeoService);
  protected readonly projects = signal<ReadonlyArray<Project>>([]);
  protected readonly insights = signal<ReadonlyArray<Insight>>([]);
  protected readonly projectsLoading = signal(true);
  protected readonly insightsLoading = signal(true);
  protected readonly projectsError = signal(false);
  protected readonly insightsError = signal(false);

  constructor() {
    this.seo.update({ title: 'The Howell Group | Building what matters.', description: 'The Howell Group — considered construction, development and project leadership for places made to last.', canonicalPath: '/' });
    if (isPlatformBrowser(this.platformId)) this.loadContent();
  }

  private loadContent(): void {
    this.projectsApi.getProjects().pipe(catchError(() => { this.projectsError.set(true); return of([]); }), takeUntilDestroyed(this.destroyRef)).subscribe(projects => { this.projects.set(projects); this.projectsLoading.set(false); });
    this.insightsApi.getInsights().pipe(catchError(() => { this.insightsError.set(true); return of([]); }), takeUntilDestroyed(this.destroyRef)).subscribe(insights => { this.insights.set(insights); this.insightsLoading.set(false); });
  }
}

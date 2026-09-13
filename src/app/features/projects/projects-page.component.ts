import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, ElementRef, PLATFORM_ID, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, Scroll } from '@angular/router';
import { PORTFOLIO_PROJECTS } from '../../core/data/projects.data';
import { SeoService } from '../../core/services/seo.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { ProjectRevealDirective } from './project-reveal.directive';
import { ProjectsListingState } from './projects-listing-state.service';

@Component({
  selector: 'app-projects-page',
  imports: [RouterLink, ProjectRevealDirective],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  private readonly state = inject(ProjectsListingState);
  private readonly document = inject(DOCUMENT);
  private readonly scroll = inject(SmoothScrollService);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;
  protected readonly query = signal(this.state.query);
  protected readonly projects = PORTFOLIO_PROJECTS;
  protected readonly filteredProjects = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return this.projects.filter(project => project.title.toLocaleLowerCase().includes(query));
  });
  protected readonly failedImages = signal<ReadonlySet<string>>(new Set());

  constructor() {
    inject(SeoService).update({
      title: 'Projects | The Howell Group',
      description: 'Explore our work. Each project brings a different vision, a distinct set of challenges, and a shared commitment to moving it forward.',
      canonicalPath: '/projects'
    });
    const router = inject(Router);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const view = this.document.defaultView;
    let frame = 0;
    // Wait until the router's own top-of-page scrolling has completed, then
    // restore instantly through Lenis. This also handles a detail's Back link.
    router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (!(event instanceof Scroll) || !this.state.restoreRequested || !view) return;
      const position = this.state.position;
      this.state.restoreRequested = false;
      if (position !== null) frame = view.requestAnimationFrame(() => this.scroll.restorePosition(position));
    });
    this.destroyRef.onDestroy(() => { if (frame) view?.cancelAnimationFrame(frame); });
  }

  protected search(value: string): void { this.query.set(value); this.state.query = value; }
  protected clearSearch(): void { this.search(''); this.searchInput?.nativeElement.focus({ preventScroll: true }); }
  protected imageFailed(slug: string): void { this.failedImages.update(current => new Set([...current, slug])); }
}

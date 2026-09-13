import { Component, DestroyRef, RESPONSE_INIT, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../../core/data/projects.data';
import { SeoService } from '../../core/services/seo.service';
import { ProjectRevealDirective } from './project-reveal.directive';
import { ProjectGalleryComponent } from './project-gallery.component';

@Component({
  selector: 'app-project-detail-page',
  imports: [RouterLink, ProjectRevealDirective, ProjectGalleryComponent],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss'
})
export class ProjectDetailPageComponent {
  private readonly project = signal<PortfolioProject | null>(null);
  protected readonly failedImages = signal<ReadonlySet<string>>(new Set());
  protected readonly details = computed(() => {
    const project = this.project();
    if (!project) return [];
    const index = PORTFOLIO_PROJECTS.findIndex(item => item.slug === project.slug);
    const next = PORTFOLIO_PROJECTS.length > 1 ? PORTFOLIO_PROJECTS[(index + 1) % PORTFOLIO_PROJECTS.length] : null;
    return [{ project, next,
      gallery: project.gallery?.filter(image => image.src.trim()) ?? [],
      facts: [
        { label: 'Location', value: project.location },
        { label: "Howell’s role", value: project.howellRole },
        { label: 'Project area', value: project.area },
        { label: 'Completion', value: project.completion }
      ].filter(fact => fact.value?.trim()),
      overview: project.overview?.paragraphs.filter(paragraph => paragraph.trim()) ?? [],
      contribution: [
        { title: 'The brief', text: project.contribution?.brief },
        { title: 'Our role', text: project.contribution?.role },
        { title: 'The outcome', text: project.contribution?.outcome }
      ].filter(section => section.text?.trim())
    }];
  });

  constructor() {
    const seo = inject(SeoService);
    const response = inject(RESPONSE_INIT, { optional: true });
    inject(ActivatedRoute).paramMap.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(params => {
      const slug = params.get('slug') ?? '';
      const project = PORTFOLIO_PROJECTS.find(item => item.slug === slug) ?? null;
      this.project.set(project);
      this.failedImages.set(new Set());
      if (response) response.status = project ? 200 : 404;
      const name = project?.title ?? 'Project not found';
      const path = `/projects/${encodeURIComponent(slug)}`;
      seo.update({
        title: `${name} | The Howell Group`,
        description: project ? `Explore ${project.title} in The Howell Group project portfolio. View project photography and learn about the work.` : 'The requested project could not be found. Explore The Howell Group project portfolio.',
        canonicalPath: path,
        image: project?.images[0].src,
        noIndex: !project,
        breadcrumbs: [{ name: 'Projects', path: '/projects' }, { name, path }]
      });
    });
  }

  protected imageFailed(src: string): void { this.failedImages.update(set => new Set([...set, src])); }
}

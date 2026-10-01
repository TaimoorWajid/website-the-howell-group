import { Component, DestroyRef, ElementRef, RESPONSE_INIT, afterRenderEffect, computed, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import gsap from 'gsap';
import { SERVICES, PROJECT_PHASES } from '../../core/data/company.data';
import { PORTFOLIO_PROJECTS } from '../../core/data/projects.data';
import { ServiceDetail } from '../../core/models/content.models';
import { SeoService } from '../../core/services/seo.service';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { SERVICE_CHAPTERS } from './services.data';

@Component({
  selector: 'app-service-detail-page',
  imports: [RouterLink],
  templateUrl: './service-detail-page.component.html',
  styleUrl: './service-detail-page.component.scss'
})
export class ServiceDetailPageComponent {
  private readonly selected = signal<ServiceDetail | null>(null);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  protected readonly details = computed(() => {
    const service = this.selected();
    if (!service) return [];
    return [{ service,
      image: SERVICE_CHAPTERS.find(chapter => chapter.id === service.slug)?.image ?? '/images/services/program-management.webp',
      phases: PROJECT_PHASES.map(phase => ({ ...phase, note: service.phaseNotes.find(note => note.number === phase.number)?.body })),
      related: SERVICES.filter(other => service.relatedServices.includes(other.slug)),
      experience: (service.teamExperience ?? []).flatMap(item => {
        const project = PORTFOLIO_PROJECTS.find(project => project.slug === item.projectSlug);
        return project ? [{ project, attribution: item.attribution }] : [];
      })
    }];
  });

  constructor() {
    const seo = inject(SeoService);
    const response = inject(RESPONSE_INIT, { optional: true });
    inject(ActivatedRoute).paramMap.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(params => {
      const slug = params.get('slug') ?? '';
      const service = SERVICES.find(item => item.slug === slug) ?? null;
      this.selected.set(service);
      if (response) response.status = service ? 200 : 404;
      const name = service?.title ?? 'Service not found';
      const path = '/services/' + encodeURIComponent(slug);
      seo.update({
        title: name + ' | The Howell Group',
        description: service?.introduction ?? 'Explore The Howell Group’s services for owners and healthcare project teams.',
        canonicalPath: path, noIndex: !service,
        breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name, path }]
      });
    });
    // Runs only in the browser, after each service's keyed DOM has rendered.
    afterRenderEffect(cleanup => {
      const service = this.selected();
      untracked(() => {
        if (!service || !this.animations.setup()) return;
        const media = gsap.matchMedia();
        const context = this.animations.createContext(this.host.nativeElement, () => {
          media.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.from(this.host.nativeElement.querySelectorAll('.hero-copy > h1, .hero-copy > .hero-body'), { y: 16, opacity: 0, duration: .65, stagger: .12 });
            this.host.nativeElement.querySelectorAll<HTMLElement>('.detail-heading, .closing-copy').forEach(element => {
              gsap.from(element, { y: 18, opacity: 0, duration: .65, scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
            });
          });
        });
        this.animations.refresh();
        cleanup(() => { media.revert(); context?.revert(); });
      });
    });
  }
}

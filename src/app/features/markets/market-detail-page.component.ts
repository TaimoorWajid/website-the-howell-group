import { Component, DestroyRef, ElementRef, NgZone, OnDestroy, RESPONSE_INIT, afterNextRender, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MARKETS, Market } from '../../core/data/markets.data';
import { PORTFOLIO_PROJECTS } from '../../core/data/projects.data';
import { SeoService } from '../../core/services/seo.service';
import { SERVICE_CHAPTERS } from '../services/services.data';
import { ProjectRevealDirective } from '../projects/project-reveal.directive';
import { MarketsMassingComponent } from './markets-massing.component';

@Component({
  selector: 'app-market-detail-page',
  imports: [RouterLink, ProjectRevealDirective, MarketsMassingComponent],
  templateUrl: './market-detail-page.component.html',
  styleUrl: './market-detail-page.component.scss'
})
export class MarketDetailPageComponent implements OnDestroy {
  private readonly selected = signal<Market | null>(null);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  protected readonly activePriority = signal(0);
  protected readonly details = computed(() => {
    const market = this.selected();
    if (!market) return [];
    return [{ market,
      related: market.detail.relatedMarkets.flatMap(slug => { const item = MARKETS.find(other => other.slug === slug && other.slug !== market.slug); return item ? [item] : []; }),
      projects: market.detail.projectSlugs.flatMap(slug => { const item = PORTFOLIO_PROJECTS.find(project => project.slug === slug); return item ? [item] : []; }),
      services: market.detail.services.flatMap(id => { const item = SERVICE_CHAPTERS.find(service => service.id === id); return item ? [item] : []; })
    }];
  });
  private cleanup?: () => void;
  private schedule?: () => void;

  constructor() {
    const seo = inject(SeoService);
    const response = inject(RESPONSE_INIT, { optional: true });
    inject(ActivatedRoute).paramMap.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(params => {
      const slug = params.get('slug') ?? '';
      const market = MARKETS.find(item => item.slug === slug) ?? null;
      this.selected.set(market); this.activePriority.set(0); this.schedule?.();
      if (response) response.status = market ? 200 : 404;
      const name = market?.name ?? 'Market not found';
      const path = `/markets/${encodeURIComponent(slug)}`;
      seo.update({ title: `${name} | The Howell Group`, description: market?.detail.intro ?? 'Explore the markets and environments that shape a project’s purpose, planning and delivery.', canonicalPath: path, image: market?.image.src, noIndex: !market, breadcrumbs: [{ name: 'Markets', path: '/markets' }, { name, path }] });
    });
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
      let frame = 0;
      const update = (): void => {
        frame = 0;
        if (!media.matches) { this.activePriority.set(0); return; }
        const target = window.innerHeight * .45;
        let index = 0; let nearest = Infinity;
        this.host.nativeElement.querySelectorAll<HTMLElement>('.priority-row').forEach((row, i) => {
          const rect = row.getBoundingClientRect(); const distance = Math.abs(rect.top + rect.height / 2 - target);
          if (distance < nearest) { nearest = distance; index = i; }
        });
        this.activePriority.set(index);
      };
      const schedule = (): void => { if (!frame) frame = window.requestAnimationFrame(update); };
      this.schedule = schedule;
      window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule, { passive: true });
      media.addEventListener('change', schedule); schedule();
      this.cleanup = () => { window.cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); media.removeEventListener('change', schedule); };
    }));
  }
  ngOnDestroy(): void { this.cleanup?.(); }
}

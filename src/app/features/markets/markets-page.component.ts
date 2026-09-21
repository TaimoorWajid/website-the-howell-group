import { Component, ElementRef, NgZone, OnDestroy, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MARKETS } from '../../core/data/markets.data';
import { SeoService } from '../../core/services/seo.service';
import { ProjectRevealDirective } from '../projects/project-reveal.directive';
import { MarketsMassingComponent } from './markets-massing.component';

@Component({
  selector: 'app-markets-page',
  imports: [RouterLink, ProjectRevealDirective, MarketsMassingComponent],
  templateUrl: './markets-page.component.html',
  styleUrl: './markets-page.component.scss'
})
export class MarketsPageComponent implements OnDestroy {
  protected readonly markets = MARKETS;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly scrolled = signal(0);
  private readonly hovered = signal<number | null>(null);
  private readonly focused = signal<number | null>(null);
  protected readonly active = computed(() => this.focused() ?? this.hovered() ?? this.scrolled());
  protected readonly perspectives = [
    { title: 'People', copy: 'Who will use the space, and what do they need?', path: 'M45 140V65L105 30l60 35v75l-60 25Zm0-75 60 35 60-35M105 100v65M70 150V95l35-20 35 20v55M70 95l35 20 35-20M105 115v50' },
    { title: 'Place', copy: 'What does the setting make possible?', path: 'M25 145V90L95 35v110Zm50 0V90l70-45v100Zm50 0V95l65-35v85ZM15 155h190M25 90l70 55M75 90l70 55M125 95l65 50' },
    { title: 'Purpose', copy: 'What must the project achieve?', path: 'M35 150V85l45-20 45 20v65M80 65v100M35 85l45 20 45-20M100 145V30l35-15 35 15v115M135 15v145M100 30l35 15 35-15M155 150V90l30-15 30 15v60M185 75v90M155 90l30 15 30-15M20 165h210' }
  ];
  private cleanup?: () => void;

  constructor() {
    inject(SeoService).update({ title: 'Markets | The Howell Group', description: 'Explore the environments that shape a project’s purpose, planning and delivery.', canonicalPath: '/markets', breadcrumbs: [{ name: 'Markets', path: '/markets' }] });
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      const media = window.matchMedia('(min-width: 768px)');
      const rows = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.market-row'));
      let frame = 0;
      const update = (): void => {
        frame = 0;
        if (!media.matches) return;
        const target = window.innerHeight * .45;
        let nearest = 0; let distance = Infinity;
        rows.forEach((row, index) => {
          const rect = row.getBoundingClientRect();
          const delta = Math.abs(rect.top + rect.height / 2 - target);
          if (delta < distance) { distance = delta; nearest = index; }
        });
        this.scrolled.set(nearest);
      };
      const schedule = (): void => { if (!frame) frame = window.requestAnimationFrame(update); };
      const change = (): void => { this.hovered.set(null); this.focused.set(null); schedule(); };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      media.addEventListener('change', change); update();
      this.cleanup = () => { window.cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); media.removeEventListener('change', change); };
    }));
  }
  protected hover(index: number, event: PointerEvent): void { if (event.pointerType !== 'touch') this.hovered.set(index); }
  protected leave(): void { this.hovered.set(null); }
  protected focus(index: number): void { this.focused.set(index); }
  protected blur(): void { this.focused.set(null); }
  ngOnDestroy(): void { this.cleanup?.(); }
}

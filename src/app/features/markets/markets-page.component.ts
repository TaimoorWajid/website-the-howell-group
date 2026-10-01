import { Component, ElementRef, NgZone, OnDestroy, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MARKETS } from '../../core/data/markets.data';
import { SeoService } from '../../core/services/seo.service';
import { ProjectRevealDirective } from '../projects/project-reveal.directive';
import { MarketsHeroComponent } from './markets-hero.component';

@Component({
  selector: 'app-markets-page',
  imports: [RouterLink, ProjectRevealDirective, MarketsHeroComponent],
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
    { title: 'People', copy: 'What do patients, residents and care teams need?', image: '/images/markets/skilled-nursing.webp', alt: 'Accessible resident lounge in a skilled nursing care environment' },
    { title: 'Place', copy: 'How does the setting support daily care?', image: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-2.webp', alt: 'Shared care space opening onto a landscaped courtyard at Aliso Ridge Behavioral Hospital' },
    { title: 'Purpose', copy: 'What does the client need the project to achieve?', image: '/images/services/design-management.webp', alt: 'Project team reviewing healthcare design plans and materials' }
  ];
  private cleanup?: () => void;

  constructor() {
    inject(SeoService).update({ title: 'Healthcare Markets | The Howell Group', description: 'Healthcare is our primary focus across Southern California. Explore five care environments and how Howell supports owner interests and coordinated delivery.', canonicalPath: '/markets', breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Markets', path: '/markets' }] });
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

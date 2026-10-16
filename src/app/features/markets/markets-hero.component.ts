import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-markets-hero',
  imports: [RouterLink],
  templateUrl: './markets-hero.component.html',
  styleUrl: './markets-hero.component.scss',
})
export class MarketsHeroComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly scrolling = inject(SmoothScrollService);
  private headerObserver?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      const header = this.document.querySelector<HTMLElement>(
        'app-header .site-header',
      );
      if (!header) return;
      const measure = () =>
        this.host.nativeElement.style.setProperty(
          '--hero-header-height',
          header.getBoundingClientRect().height + 'px',
        );
      measure();
      this.headerObserver = new ResizeObserver(measure);
      this.headerObserver.observe(header);
    });
  }

  explore(event: MouseEvent): void {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    const target = this.document.getElementById('market-explorer');
    if (!target) return;
    event.preventDefault();
    if (prefersReducedMotion()) target.scrollIntoView({ behavior: 'instant' });
    else this.scrolling.scrollTo('#market-explorer');
    target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    history.replaceState(history.state, '', '/markets#market-explorer');
  }

  ngOnDestroy(): void {
    this.headerObserver?.disconnect();
  }
}

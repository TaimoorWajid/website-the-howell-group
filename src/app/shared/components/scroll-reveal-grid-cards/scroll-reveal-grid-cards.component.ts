import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, afterNextRender, computed, inject, signal } from '@angular/core';

export interface ScrollRevealCard {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  number?: string;
  icon?: string;
  href?: string;
}

@Component({
  selector: 'app-scroll-reveal-grid-cards',
  templateUrl: './scroll-reveal-grid-cards.component.html',
  styleUrl: './scroll-reveal-grid-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollRevealGridCardsComponent implements OnDestroy {
  private readonly data = signal<readonly ScrollRevealCard[]>([]);
  /** This section is a single four-card story, never an unbounded grid. */
  @Input() set cards(value: readonly ScrollRevealCard[]) { this.data.set((value ?? []).slice(0, 4)); }
  @Input() label = 'Scroll below to see effect';
  @Input() reverseOnExit = true;

  protected readonly enhanced = signal(false);
  protected readonly columns = signal(4);
  protected readonly positions = signal<readonly number[]>([]);
  protected readonly rows = computed(() => Array.from(
    { length: Math.ceil(this.data().length / this.columns()) },
    (_, i) => this.data().slice(i * this.columns(), (i + 1) * this.columns())
  ));
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private observer?: ResizeObserver;
  private motion?: MediaQueryList;
  private started = false;
  private destroyed = false;
  private scrollFrame: number | null = null;

  constructor() {
    // Browser-only enhancement: SSR/no-JS content stays readable.
    afterNextRender(() => {
      if (this.destroyed) return;
      this.started = true;
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.motion.addEventListener('change', this.configure);
      window.addEventListener('resize', this.configure, { passive: true });
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.observer = new ResizeObserver(this.onScroll);
      this.observer.observe(this.host.nativeElement);
      this.configure();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.destroyed = true;
    if (!this.started) return;
    this.motion?.removeEventListener('change', this.configure);
    window.removeEventListener('resize', this.configure);
    window.removeEventListener('scroll', this.onScroll);
    if (this.scrollFrame !== null) cancelAnimationFrame(this.scrollFrame);
  }

  protected rowProgress(row: number): number { return this.enhanced() ? this.positions()[row] ?? 0 : 1; }
  protected amount(row: number, index: number): number {
    return revealAmount(this.rowProgress(row), index, this.rows()[row]?.length ?? 1);
  }
  protected cueOpacity(row: number): number { return Math.max(0, 1 - this.rowProgress(row) / .12); }
  protected lineProgress(row: number): number { return Math.min(1, Math.max(0, (this.rowProgress(row) - .12) / .65)); }
  private readonly configure = (): void => {
    const width = this.host.nativeElement.clientWidth;
    this.columns.set(width <= 640 ? 1 : width <= 1024 ? 2 : 4);
    this.enhanced.set(!this.motion?.matches);
    this.onScroll();
  };

  private readonly onScroll = (): void => {
    if (this.destroyed || this.scrollFrame !== null) return;
    this.scrollFrame = requestAnimationFrame(() => { this.scrollFrame = null; this.updateProgress(); });
  };

  private updateProgress(): void {
    if (!this.enhanced()) return;
    const previous = this.positions();
    const next = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('[data-scroll-row]'), (row, index) => {
      const rect = row.getBoundingClientRect();
      const stage = row.firstElementChild as HTMLElement;
      const stickyTop = Math.min(0, window.innerHeight - stage.offsetHeight);
      stage.style.setProperty('--sticky-top', stickyTop + 'px');
      const travel = Math.max(1, rect.height - stage.offsetHeight);
      const value = Math.min(1, Math.max(0, (stickyTop - rect.top) / travel));
      return this.reverseOnExit ? value : Math.max(previous[index] ?? 0, value);
    });
    if (next.length !== previous.length || next.some((p, i) => p !== previous[i])) this.positions.set(next);
  }
}

/** Scroll intervals replace timed delays: every position has a reproducible frame. */
export function revealAmount(progress: number, index: number, count: number): number {
  const start = .12 + index * (.58 / Math.max(count, 1));
  const raw = Math.min(1, Math.max(0, (progress - start) / .28));
  return 1 - Math.pow(1 - raw, 3);
}

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, computed, inject, input, signal } from '@angular/core';
import { PortfolioImage } from '../../core/data/projects.data';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-project-gallery',
  templateUrl: './project-gallery.component.html',
  styleUrl: './project-gallery.component.scss'
})
export class ProjectGalleryComponent implements OnDestroy {
  readonly images = input.required<readonly PortfolioImage[]>();
  readonly projectTitle = input.required<string>();
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('closeButton', { static: true }) private closeButton!: ElementRef<HTMLButtonElement>;
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly scroll = inject(SmoothScrollService);
  protected readonly active = signal(0);
  protected readonly opened = signal(false);
  protected readonly current = computed(() => this.images()[this.active()]);
  protected readonly failedImages = signal<ReadonlySet<string>>(new Set());
  private opener: HTMLElement | null = null;
  private unlock?: () => void;

  open(index = 0, event?: Event): void {
    if (!isPlatformBrowser(this.platform) || !this.images().length) return;
    const dialog = this.dialog.nativeElement;
    if (dialog.open) return;
    this.opener = (event?.currentTarget ?? this.document.activeElement) as HTMLElement | null;
    this.active.set(Math.max(0, Math.min(index, this.images().length - 1)));
    this.opened.set(true);
    try {
      dialog.showModal();
      this.lockScroll();
      this.closeButton.nativeElement.focus({ preventScroll: true });
    } catch { this.opened.set(false); if (dialog.open) dialog.close(); this.cleanup(false); }
  }

  close(): void {
    if (this.dialog.nativeElement.open) this.dialog.nativeElement.close();
    this.cleanup(true);
  }

  protected select(index: number): void { this.active.set(index); }
  protected step(delta: number): void { this.active.set((this.active() + delta + this.images().length) % this.images().length); }
  protected imageFailed(src: string): void { this.failedImages.update(set => new Set([...set, src])); }
  protected cancel(event: Event): void { event.preventDefault(); event.stopPropagation(); this.close(); }
  protected nativeClose(): void { if (!this.dialog.nativeElement.open) this.cleanup(true); }

  protected keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.close(); return; }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); event.stopPropagation(); this.step(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); this.select(event.key === 'Home' ? 0 : this.images().length - 1);
    } else if (event.key === 'Tab') {
      const targets = Array.from(this.dialog.nativeElement.querySelectorAll<HTMLButtonElement>('button:not([disabled])')).filter(button => button.getClientRects().length > 0);
      const first = targets[0]; const last = targets[targets.length - 1];
      if (event.shiftKey && this.document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && this.document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }

  private lockScroll(): void {
    const view = this.document.defaultView;
    if (!view) return;
    const body = this.document.body; const html = this.document.documentElement;
    const saved = ([[body, 'overflow'], [body, 'padding-right'], [html, 'overflow']] as const).map(([element, property]) => ({ element, property, value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) }));
    const scrollbar = view.innerWidth - html.clientWidth;
    const padding = parseFloat(view.getComputedStyle(body).paddingRight) || 0;
    this.scroll.stop();
    body.style.setProperty('overflow', 'hidden'); html.style.setProperty('overflow', 'hidden');
    if (scrollbar > 0) body.style.setProperty('padding-right', `${padding + scrollbar}px`);
    this.unlock = () => {
      for (const { element, property, value, priority } of saved) {
        if (value) element.style.setProperty(property, value, priority); else element.style.removeProperty(property);
      }
      this.scroll.start();
    };
  }

  private cleanup(returnFocus: boolean): void {
    this.unlock?.(); this.unlock = undefined; this.opened.set(false);
    const opener = this.opener; this.opener = null;
    if (returnFocus && opener?.isConnected) opener.focus({ preventScroll: true });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platform) && this.dialog.nativeElement.open) this.dialog.nativeElement.close();
    this.cleanup(false);
  }
}

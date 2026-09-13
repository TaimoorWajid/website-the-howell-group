import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, PLATFORM_ID, ViewChild, inject, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import gsap from 'gsap';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { prefersReducedMotion } from '../../core/animations/animation.util';
import { MegaMenuConfig } from './mega-menu.types';
import { NavigationIconComponent } from './navigation-icon.component';
import { BrandLogoComponent } from '../../shared/components/brand-logo.component';

@Component({
  selector: 'app-mobile-navigation',
  imports: [RouterLink, RouterLinkActive, NavigationIconComponent, BrandLogoComponent],
  templateUrl: './mobile-navigation.component.html',
  styleUrl: './mobile-navigation.component.scss'
})
export class MobileNavigationComponent implements OnDestroy {
  @Input({ required: true }) menus: readonly MegaMenuConfig[] = [];
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  readonly openedChange = output<boolean>();
  readonly insightsRequested = output<void>();
  protected readonly expanded = signal<string | null>(null);
  protected readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly smoothScroll = inject(SmoothScrollService);
  private tween?: gsap.core.Tween;
  private opener: HTMLElement | null = null;
  private restoreScroll?: () => void;
  private closing = false;

  open(): void {
    if (!isPlatformBrowser(this.platformId) || !window.matchMedia('(width < 768px)').matches) return;
    const dialog = this.dialog.nativeElement;
    if (dialog.open) return;
    this.opener = this.document.activeElement as HTMLElement | null;
    this.expanded.set(null);
    this.lockScroll();
    // Native modal semantics make the background inert and contain keyboard focus.
    dialog.showModal();
    dialog.scrollTop = 0;
    this.openedChange.emit(true);
    this.tween = gsap.fromTo(dialog, { opacity: 0, y: 10 }, {
      opacity: 1, y: 0, duration: prefersReducedMotion() ? 0 : .28, ease: 'power2.out'
    });
  }

  close(restoreFocus = true, immediate = false): void {
    const dialog = this.dialog.nativeElement;
    if (!dialog.open) return;
    if (this.closing && !immediate) return;
    this.closing = true;
    this.tween?.kill();
    const finish = (): void => {
      dialog.close();
      this.cleanup();
      if (restoreFocus && this.opener?.isConnected) this.opener.focus({ preventScroll: true });
    };
    if (immediate || prefersReducedMotion()) finish();
    else this.tween = gsap.to(dialog, { opacity: 0, y: 8, duration: .18, ease: 'power2.in', onComplete: finish });
  }

  protected toggle(id: string): void {
    this.expanded.set(this.expanded() === id ? null : id);
    if (id === 'insights') this.insightsRequested.emit();
  }

  protected cancel(event: Event): void { event.preventDefault(); this.close(); }
  protected followLink(): void { this.close(true, true); }

  protected containTab(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const targets = Array.from(this.dialog.nativeElement.querySelectorAll<HTMLElement>('a[href], button'))
      .filter(element => element.getClientRects().length > 0);
    const first = targets[0];
    const last = targets[targets.length - 1];
    if (event.shiftKey && this.document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && this.document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  protected cleanup(): void {
    // A queued native close event can arrive after a rapid reopen.
    if (this.dialog.nativeElement.open) return;
    this.tween?.kill();
    this.restoreScroll?.();
    this.restoreScroll = undefined;
    this.closing = false;
    this.expanded.set(null);
    this.openedChange.emit(false);
  }

  private lockScroll(): void {
    const body = this.document.body;
    const html = this.document.documentElement;
    const properties = [[body, 'overflow'], [body, 'padding-right'], [html, 'overflow']] as const;
    const saved = properties.map(([element, property]) => ({ element, property,
      value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) }));
    const scrollbar = window.innerWidth - html.clientWidth;
    const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    this.smoothScroll.stop();
    body.style.setProperty('overflow', 'hidden');
    html.style.setProperty('overflow', 'hidden');
    if (scrollbar > 0) body.style.setProperty('padding-right', `${padding + scrollbar}px`);
    this.restoreScroll = () => {
      for (const { element, property, value, priority } of saved) {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      }
      this.smoothScroll.start();
    };
  }

  ngOnDestroy(): void {
    this.tween?.kill();
    if (this.dialog.nativeElement.open) this.dialog.nativeElement.close();
    this.restoreScroll?.();
  }
}

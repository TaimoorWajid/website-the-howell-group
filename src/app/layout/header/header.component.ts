import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnDestroy,
  AfterViewInit,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { MEGA_MENUS } from './mega-menu.data';
import { MegaMenuConfig } from './mega-menu.types';
import { MegaMenuComponent } from './mega-menu.component';
import { MobileNavigationComponent } from './mobile-navigation.component';
import { NavigationIconComponent } from './navigation-icon.component';
import { BrandLogoComponent } from '../../shared/components/brand-logo.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MegaMenuComponent,
    MobileNavigationComponent,
    NavigationIconComponent,
    BrandLogoComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '(document:keydown.escape)': 'escape($event)',
    '(document:click)': 'outsideClick($event)',
    '(document:focusin)': 'outsideFocus($event)',
  },
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild(MegaMenuComponent) private panel?: MegaMenuComponent;
  @ViewChild(MobileNavigationComponent)
  private mobile?: MobileNavigationComponent;
  protected readonly menus = signal(MEGA_MENUS);
  protected readonly active = signal<MegaMenuConfig | null>(null);
  protected readonly closing = signal(false);
  protected readonly menuOpen = signal(false);
  private trigger: HTMLButtonElement | null = null;
  private media?: MediaQueryList;
  private hoverCloseTimer?: ReturnType<typeof setTimeout>;
  private observer?: ResizeObserver;
  private readonly resize = (): void => {
    const hadMobileMenu = this.menuOpen();
    const hadDesktopMenu = !!this.active();
    this.close(false, true);
    this.mobile?.close(false, true);
    if (hadMobileMenu)
      this.element.nativeElement
        .querySelector<HTMLElement>('.brand')
        ?.focus({ preventScroll: true });
    else if (hadDesktopMenu)
      this.element.nativeElement
        .querySelector<HTMLElement>('.menu-button')
        ?.focus({ preventScroll: true });
  };

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.close(false, true);
          this.mobile?.close(true, true);
        }
      });
  }
  ngAfterViewInit(): void {
    this.smoothScroll.initialize();
    if (!isPlatformBrowser(this.platformId)) return;
    this.media = window.matchMedia('(width < 768px)');
    this.media.addEventListener('change', this.resize);
    const updateTop = (): void => {
      const bottom = this.element.nativeElement
        .querySelector('header')!
        .getBoundingClientRect().bottom;
      this.element.nativeElement.style.setProperty(
        '--menu-available-height',
        `${Math.max(0, window.innerHeight - Math.max(0, bottom))}px`,
      );
    };
    this.observer = new ResizeObserver(updateTop);
    this.observer.observe(this.element.nativeElement.querySelector('header')!);
    window.addEventListener('resize', updateTop);
    window.addEventListener('scroll', updateTop, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('resize', updateTop);
      window.removeEventListener('scroll', updateTop);
    });
  }
  protected toggle(config: MegaMenuConfig, event: Event): void {
    if (
      (event as PointerEvent).pointerType === 'mouse' &&
      (event as MouseEvent).detail > 0
    )
      return;
    if (this.media?.matches) return;
    if (this.active()?.id === config.id && !this.closing()) {
      this.close();
      return;
    }
    this.openMenu(config, event.currentTarget as HTMLButtonElement);
  }
  private openMenu(config: MegaMenuConfig, trigger: HTMLButtonElement): void {
    this.cancelHoverClose();
    this.trigger = trigger;
    this.panel?.cancelClose();
    this.closing.set(false);
    this.active.set(config);
  }
  protected hoverTrigger(config: MegaMenuConfig, event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || this.media?.matches) return;
    this.openMenu(
      config,
      (event.currentTarget as HTMLElement).closest('button')!,
    );
  }
  protected hoverPanel(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !this.active()) return;
    this.cancelHoverClose();
    this.panel?.cancelClose();
    this.closing.set(false);
  }
  protected leaveMenu(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !this.active()) return;
    this.cancelHoverClose();
    // Allow the pointer to cross the header spacing between label and panel.
    this.hoverCloseTimer = setTimeout(() => this.close(), 180);
  }
  private cancelHoverClose(): void {
    clearTimeout(this.hoverCloseTimer);
    this.hoverCloseTimer = undefined;
  }
  protected tabIntoPanel(event: Event, id: string): void {
    if (
      !(event as KeyboardEvent).shiftKey &&
      this.active()?.id === id &&
      !this.closing()
    )
      this.enterPanel(event);
  }
  protected enterPanel(event: Event): void {
    event.preventDefault();
    this.element.nativeElement
      .querySelector<HTMLElement>('.mega-shell a')
      ?.focus();
  }
  protected escape(event: Event): void {
    if (this.active()) {
      event.preventDefault();
      this.close(true);
    } else if (this.menuOpen()) {
      event.preventDefault();
      this.mobile?.close();
    }
  }
  protected outsideClick(event: Event): void {
    if (!this.element.nativeElement.contains(event.target as Node))
      this.close();
  }
  protected outsideFocus(event: Event): void {
    if (!this.element.nativeElement.contains(event.target as Node))
      this.close();
  }
  protected close(restoreFocus = false, immediate = false): void {
    this.cancelHoverClose();
    if (!this.active()) return;
    if (
      restoreFocus ||
      this.element.nativeElement
        .querySelector('.mega-shell:not([hidden])')
        ?.contains(this.document.activeElement)
    )
      this.trigger?.focus();
    if (immediate) {
      this.active.set(null);
      this.closing.set(false);
      return;
    }
    if (this.closing()) return;
    this.closing.set(true);
    const id = this.active()?.id;
    this.panel?.close(() => {
      if (this.active()?.id === id && this.closing()) {
        this.active.set(null);
        this.closing.set(false);
      }
    });
  }
  ngOnDestroy(): void {
    this.cancelHoverClose();
    this.media?.removeEventListener('change', this.resize);
    this.observer?.disconnect();
    this.smoothScroll.destroy();
  }
}

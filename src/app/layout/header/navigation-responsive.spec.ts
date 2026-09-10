import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { InsightApiService } from '../../core/api/insight-api.service';
import { MEGA_MENUS } from './mega-menu.data';

// Resize Karma's same-origin context frame to exercise real CSS/media queries,
// including widths below Chrome's minimum outer-window width.
describe('Navigation responsive interactions', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let root: HTMLElement;
  let frame: HTMLElement;
  let originalFrameStyle: string;
  let reducedMotion = true;
  const scroll = { initialize: jasmine.createSpy(), destroy: jasmine.createSpy(), stop: jasmine.createSpy(), start: jasmine.createSpy() };
  const render = async (): Promise<void> => { fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges(); };
  const resize = async (width: number, height = 800): Promise<void> => {
    frame.style.width = `${width}px`; frame.style.height = `${height}px`;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await render();
    expect(window.innerWidth).withContext('Real viewport width').toBe(width);
  };
  const click = async (selector: string): Promise<void> => { root.querySelector<HTMLElement>(selector)!.click(); await render(); };
  const dialog = (): HTMLDialogElement => root.querySelector<HTMLDialogElement>('dialog')!;
  const openMobile = async (): Promise<void> => { root.querySelector<HTMLElement>('.menu-button')!.focus(); await click('.menu-button'); };

  beforeEach(async () => {
    frame = window.frameElement as HTMLElement;
    if (!frame) throw new Error('Run this suite in the standard Karma iframe context.');
    originalFrameStyle = frame.style.cssText;
    reducedMotion = true;
    scroll.stop.calls.reset(); scroll.start.calls.reset();
    const original = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const media = original(query);
      if (query.includes('prefers-reduced-motion')) Object.defineProperty(media, 'matches', { value: reducedMotion });
      return media;
    });
    await TestBed.configureTestingModule({ imports: [HeaderComponent], providers: [provideZonelessChangeDetection(), provideRouter([{ path: '**', children: [] }]),
      { provide: SmoothScrollService, useValue: scroll }, { provide: InsightApiService, useValue: { getInsights: () => of([]) } }] }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent); root = fixture.nativeElement;
    await render();
    await resize(375);
  });
  afterEach(() => { fixture.destroy(); frame.style.cssText = originalFrameStyle; });

  it('uses mobile only below 768px and fits all requested viewports without horizontal overflow', async () => {
    for (const width of [375, 430, 768, 1024, 1440]) {
      await resize(width);
      const mobile = width < 768;
      expect(getComputedStyle(root.querySelector('.menu-button')!).display === 'none').toBe(!mobile);
      expect(getComputedStyle(root.querySelector('.site-header > nav')!).display === 'none').toBe(mobile);
      if (mobile) {
        await openMobile();
        await click('#mobile-trigger-services');
        expect(dialog().open).toBeTrue();
        expect(dialog().scrollWidth).toBeLessThanOrEqual(dialog().clientWidth);
        expect(root.querySelector('.mobile-close')!.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
        await click('.mobile-close');
      } else {
        for (const menu of MEGA_MENUS) {
          await click(`#trigger-${menu.id}`);
          const panel = root.querySelector<HTMLElement>('.mega-shell:not([hidden])')!;
          expect(panel.scrollWidth).withContext(`${width}px ${menu.id}`).toBeLessThanOrEqual(panel.clientWidth);
          expect(panel.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight + 1);
        }
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await render();
      }
      expect(document.documentElement.scrollWidth).withContext(`${width}px page width`).toBeLessThanOrEqual(width);
      expect(root.textContent).not.toContain('?');
    }
  });

  it('preserves every desktop destination in one-open-at-a-time mobile accordions', async () => {
    await openMobile();
    for (const menu of MEGA_MENUS) {
      await click(`#mobile-trigger-${menu.id}`);
      expect(root.querySelectorAll('.accordion:not([hidden])').length).toBe(1);
      expect(root.querySelector(`#mobile-trigger-${menu.id}`)?.getAttribute('aria-expanded')).toBe('true');
      const content = root.querySelector(`#mobile-section-${menu.id}`)!;
      const destinations = Array.from(content.querySelectorAll('a')).map(link => link.getAttribute('href'));
      for (const section of menu.sections) for (const item of section.items) {
        expect(destinations).toContain(item.route);
        expect(content.textContent).toContain(item.title);
      }
      expect(destinations).toContain(menu.feature.route);
      expect(destinations).toContain(menu.path);
    }
    await click('#mobile-trigger-insights');
    expect(root.querySelectorAll('.accordion:not([hidden])').length).toBe(0);
  });

  it('contains keyboard focus and restores it and scroll styles on Escape', async () => {
    const beforeBody = document.body.style.cssText;
    const beforeHtml = document.documentElement.style.cssText;
    await openMobile();
    expect(document.activeElement).toBe(root.querySelector('.mobile-close'));
    expect(dialog().matches(':modal')).toBeTrue();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(scroll.stop).toHaveBeenCalledTimes(1);
    root.querySelector<HTMLElement>('.mobile-cta')!.focus();
    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(root.querySelector('.mobile-brand'));
    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(root.querySelector('.mobile-cta'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await render();
    expect(dialog().open).toBeFalse();
    expect(document.activeElement).toBe(root.querySelector('.menu-button'));
    expect(document.body.style.cssText).toBe(beforeBody);
    expect(document.documentElement.style.cssText).toBe(beforeHtml);
    expect(scroll.start).toHaveBeenCalledTimes(1);
  });

  it('closes on selected links and router navigation, and resets on crossing to desktop', async () => {
    await openMobile(); await click('#mobile-trigger-about');
    await click('#mobile-section-about a[href="/careers"]');
    expect(dialog().open).toBeFalse();
    expect(TestBed.inject(Router).url).toBe('/careers');
    await openMobile();
    expect(root.querySelectorAll('.mobile-category.route-active').length).toBe(1);
    expect(root.querySelector('.mobile-category.route-active > button')?.id).toBe('mobile-trigger-about');
    await TestBed.inject(Router).navigateByUrl('/projects'); await render();
    expect(dialog().open).toBeFalse();
    await openMobile(); await click('#mobile-trigger-services');
    await resize(768);
    expect(dialog().open).toBeFalse();
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.activeElement).toBe(root.querySelector('.brand'));
    await resize(430); await openMobile();
    expect(root.querySelectorAll('.accordion:not([hidden])').length).toBe(0);
  });

  it('scrolls internally on short screens and keeps the CTA reachable', async () => {
    await resize(375, 400); await openMobile(); await click('#mobile-trigger-services');
    expect(dialog().clientHeight).toBeLessThanOrEqual(400);
    expect(dialog().scrollHeight).toBeGreaterThan(dialog().clientHeight);
    dialog().scrollTop = dialog().scrollHeight;
    expect(root.querySelector('.mobile-cta')!.getBoundingClientRect().bottom).toBeLessThanOrEqual(400);
    await click('.mobile-close');
    await resize(1024, 400); await click('#trigger-services');
    const panel = root.querySelector<HTMLElement>('.mega-shell:not([hidden])')!;
    expect(panel.scrollHeight).toBeGreaterThan(panel.clientHeight);
    expect(getComputedStyle(panel).overflowY).toBe('auto');
    panel.scrollTop = panel.scrollHeight;
    expect(panel.querySelector('.menu-footer')!.getBoundingClientRect().bottom).toBeLessThanOrEqual(401);
  });

  it('finishes an animated close and survives an immediate reopen without releasing its scroll lock', async () => {
    reducedMotion = false;
    await openMobile(); await click('.mobile-close');
    expect(dialog().open).toBeTrue();
    await new Promise(resolve => setTimeout(resolve, 350)); await render();
    expect(dialog().open).toBeFalse();
    reducedMotion = true;
    await openMobile();
    // Reopen before the queued native close event is dispatched.
    root.querySelector<HTMLElement>('.mobile-close')!.click();
    root.querySelector<HTMLElement>('.menu-button')!.click();
    await render(); await new Promise(resolve => setTimeout(resolve, 30));
    expect(dialog().open).toBeTrue();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores pre-existing scroll styles when destroyed while open', async () => {
    const bodyStyle = document.body.style.cssText;
    const htmlStyle = document.documentElement.style.cssText;
    try {
      document.body.style.setProperty('overflow', 'clip', 'important');
      document.body.style.paddingRight = '7px';
      document.documentElement.style.overflow = 'auto';
      await openMobile();
      fixture.destroy();
      expect(document.body.style.getPropertyValue('overflow')).toBe('clip');
      expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
      expect(document.body.style.paddingRight).toBe('7px');
      expect(document.documentElement.style.overflow).toBe('auto');
      expect(scroll.start).toHaveBeenCalledTimes(1);
    } finally {
      document.body.style.cssText = bodyStyle;
      document.documentElement.style.cssText = htmlStyle;
    }
  });
});

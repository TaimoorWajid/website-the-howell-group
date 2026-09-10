import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { InsightApiService } from '../../core/api/insight-api.service';
import { MEGA_MENUS } from './mega-menu.data';

describe('Header mega menu', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let root: HTMLElement;
  const scroll = { initialize: jasmine.createSpy(), destroy: jasmine.createSpy(), stop: jasmine.createSpy(), start: jasmine.createSpy() };
  beforeEach(async () => {
    const original = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const result = original(query);
      if (query.includes('prefers-reduced-motion')) Object.defineProperty(result, 'matches', { value: true });
      return result;
    });
    await TestBed.configureTestingModule({ imports: [HeaderComponent], providers: [provideZonelessChangeDetection(), provideRouter([{ path: '**', children: [] }]), { provide: SmoothScrollService, useValue: scroll }, { provide: InsightApiService, useValue: { getInsights: () => of([]) } }] }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });
  afterEach(() => fixture.destroy());
  function open(id: string): HTMLButtonElement {
    const trigger = root.querySelector<HTMLButtonElement>(`#trigger-${id}`)!;
    trigger.click(); fixture.detectChanges(); return trigger;
  }
  it('opens each category with one panel and valid disclosure relationships', () => {
    for (const menu of MEGA_MENUS) {
      const trigger = open(menu.id);
      expect(root.querySelectorAll('app-mega-menu').length).toBe(1);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(root.querySelector('#' + trigger.getAttribute('aria-controls'))?.hasAttribute('hidden')).toBeFalse();
      expect(root.querySelector('app-mega-menu h2')?.textContent).toContain(menu.introduction);
    }
  });
  it('toggles closed and removes links from keyboard navigation', () => {
    open('services'); open('services');
    expect(root.querySelector('app-mega-menu')).toBeNull();
    expect(root.querySelector('#trigger-services')?.getAttribute('aria-expanded')).toBe('false');
  });
  it('moves Tab into the panel and restores focus with Escape', () => {
    const trigger = open('about'); trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(root.querySelector('app-mega-menu')?.contains(document.activeElement)).toBeTrue();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); fixture.detectChanges();
    expect(root.querySelector('app-mega-menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it('ignores internal clicks and closes on outside clicks', () => {
    open('projects');
    root.querySelector('app-mega-menu h2')!.dispatchEvent(new MouseEvent('click', { bubbles: true })); fixture.detectChanges();
    expect(root.querySelector('app-mega-menu')).not.toBeNull();
    document.body.click(); fixture.detectChanges();
    expect(root.querySelector('app-mega-menu')).toBeNull();
  });
  it('closes after SPA navigation and highlights the parent category', async () => {
    open('services');
    await TestBed.inject(Router).navigateByUrl('/services/construction'); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    expect(root.querySelector('app-mega-menu')).toBeNull();
    expect(root.querySelector('#trigger-services')?.parentElement?.classList.contains('route-active')).toBeTrue();
  });
  it('does not open the mobile dialog at desktop widths', () => {
    root.querySelector<HTMLButtonElement>('.menu-button')!.click(); fixture.detectChanges();
    expect(root.querySelector<HTMLDialogElement>('#primary-navigation')!.open).toBeFalse();
  });
  it('uses published parent destinations and never exposes fictional article metadata', () => {
    const valid = ['/projects', '/services', '/about', '/insights', '/contact', '/careers'];
    for (const menu of MEGA_MENUS) for (const section of menu.sections) for (const item of section.items) expect(valid).toContain(item.route);
    open('insights');
    expect(root.querySelector('.feature-date')).toBeNull();
    expect(root.querySelector('.feature')?.getAttribute('href')).toBe('/insights');
  });
  it('does not mutate body sizing or scroll locking when opened', () => {
    const before = document.body.style.cssText;
    open('services');
    expect(document.body.style.cssText).toBe(before);
    expect(root.querySelector('.mega-shell:not([hidden])')?.hasAttribute('data-lenis-prevent')).toBeTrue();
  });
  it('renders SVG directional icons and distinct context icons without placeholder glyphs', () => {
    open('projects');
    expect(root.textContent).not.toContain('?');
    const paths = Array.from(root.querySelectorAll('app-mega-menu .item-icon path')).map(path => path.getAttribute('d'));
    expect(new Set(paths).size).toBe(3);
    expect(root.querySelectorAll('app-mega-menu .item-arrow svg').length).toBe(3);
  });
});

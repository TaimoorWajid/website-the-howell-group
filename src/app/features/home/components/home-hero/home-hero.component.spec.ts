import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HomeHeroComponent } from './home-hero.component';
import { ThreeRendererService } from '../../../../core/three/three-renderer.service';

describe('Owner-focused homepage hero', () => {
  let fixture: ComponentFixture<HomeHeroComponent>;
  let root: HTMLElement;
  let frame: HTMLElement;
  let frameStyle: string;
  let reduced = true;
  const renderer = { create: jasmine.createSpy('create').and.throwError('WebGL unavailable') };
  const render = async (): Promise<void> => { fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges(); };
  const resize = async (width: number): Promise<void> => {
    frame.style.width = `${width}px`; frame.style.height = '900px';
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await render(); expect(window.innerWidth).toBe(width);
  };
  beforeEach(async () => {
    reduced = true; renderer.create.calls.reset();
    frame = window.frameElement as HTMLElement; frameStyle = frame.style.cssText;
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const result = match(query);
      if (query.includes('prefers-reduced-motion')) Object.defineProperty(result, 'matches', { get: () => reduced });
      return result;
    });
    await TestBed.configureTestingModule({ imports: [HomeHeroComponent], providers: [provideZonelessChangeDetection(), provideRouter([{ path: '**', children: [] }]), { provide: ThreeRendererService, useValue: renderer }] }).compileComponents();
    fixture = TestBed.createComponent(HomeHeroComponent); root = fixture.nativeElement;
    await render();
  });
  afterEach(() => { fixture.destroy(); frame.style.cssText = frameStyle; });

  it('keeps the exact copy, one heading and both valid routes in the initial markup', () => {
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('.hero-eyebrow')?.textContent).toBe('OWNER-FOCUSED PROJECT LEADERSHIP');
    expect(root.querySelectorAll('.heading-line')[0].textContent).toBe('Clarity at every turn.');
    expect(root.querySelectorAll('.heading-line')[1].textContent).toBe('Confidence at every stage.');
    expect(root.querySelector('.hero-lede')?.textContent).toBe('The Howell Group aligns people, process and decisions to deliver complex projects with purpose\u2014from the first conversation through final closeout.');
    expect(Array.from(root.querySelectorAll('a')).map(a => a.getAttribute('href'))).toEqual(['/projects', '/contact']);
    expect(root.querySelector('img')?.getAttribute('src')).toBe('/images/hero/architectural-study.svg');
    expect(root.querySelector('.architecture')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('fits all eight requested widths with legible copy, two desktop lines and touch-sized links', async () => {
    for (const width of [1600,1440,1280,1024,768,430,390,360]) {
      await resize(width);
      expect(document.documentElement.scrollWidth).withContext(`${width}px overflow`).toBeLessThanOrEqual(width);
      const copy = root.querySelector('.hero-copy')!.getBoundingClientRect();
      const visual = root.querySelector('.hero-architecture')!.getBoundingClientRect();
      if (width <= 768) expect(visual.top).toBeGreaterThanOrEqual(copy.bottom - 1);
      else {
        const heading = root.querySelector('h1')!;
        const lineHeight = parseFloat(getComputedStyle(heading).lineHeight);
        for (const line of root.querySelectorAll('.heading-line > span')) expect(line.getBoundingClientRect().height).withContext(`${width}px heading line`).toBeLessThanOrEqual(lineHeight + 1);
      }
      for (const link of root.querySelectorAll('a')) {
        expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
        expect(link.getBoundingClientRect().right).toBeLessThanOrEqual(width);
      }
      expect(visual.height).toBeGreaterThan(200);
    }
  });

  it('leaves reduced-motion content immediately visible without initializing WebGL', async () => {
    await new Promise(resolve => setTimeout(resolve, 60));
    expect(renderer.create).not.toHaveBeenCalled();
    expect(root.querySelector('canvas')).toBeNull();
    expect(getComputedStyle(root.querySelector('.hero-lede')!).opacity).toBe('1');
    expect(getComputedStyle(root.querySelector('.architecture-fallback')!).opacity).toBe('1');
  });

  it('retains the fallback when WebGL initialization fails', async () => {
    reduced = false;
    await resize(430); await resize(1440);
    await new Promise(resolve => setTimeout(resolve, 250)); await render();
    expect(renderer.create).toHaveBeenCalled();
    expect(root.querySelector('.is-ready')).toBeNull();
    expect(getComputedStyle(root.querySelector('.architecture-fallback')!).opacity).toBe('1');
    expect(root.querySelectorAll('a').length).toBe(2);
  });

  it('navigates through both CTA links and allows keyboard focus', async () => {
    for (const link of root.querySelectorAll<HTMLAnchorElement>('a')) {
      link.focus(); expect(document.activeElement).toBe(link);
      link.click(); await render();
      expect(TestBed.inject(Router).url).toBe(link.getAttribute('href')!);
    }
  });

  it('cancels deferred scene initialization when the route destroys the hero', async () => {
    fixture.destroy(); reduced = false;
    fixture = TestBed.createComponent(HomeHeroComponent);
    fixture.detectChanges();
    fixture.destroy();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(renderer.create).not.toHaveBeenCalled();
  });
});

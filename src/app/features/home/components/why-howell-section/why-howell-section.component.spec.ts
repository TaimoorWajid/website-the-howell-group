import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { WhyHowellSectionComponent } from './why-howell-section.component';
import { AnimationManagerService } from '../../../../core/animations/animation-manager.service';

describe('Why Howell section', () => {
  let fixture: ComponentFixture<WhyHowellSectionComponent>;
  let root: HTMLElement;
  let frame: HTMLElement;
  let originalStyle: string;
  let reduced: boolean;
  let motionQueries: MediaQueryList[];
  const tick = (): Promise<void> => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  const render = async (): Promise<void> => { fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges(); };
  const create = async (motionReduced = true, offset = 0): Promise<void> => {
    reduced = motionReduced;
    fixture = TestBed.createComponent(WhyHowellSectionComponent); root = fixture.nativeElement;
    root.style.marginTop = `${offset}px`;
    await render(); await tick();
  };
  beforeEach(async () => {
    motionQueries = [];
    frame = window.frameElement as HTMLElement; originalStyle = frame.style.cssText;
    frame.style.width = '1440px'; frame.style.height = '900px';
    window.scrollTo(0, 0);
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const media = match(query);
      if (query.includes('prefers-reduced-motion')) {
        Object.defineProperty(media, 'matches', { get: () => reduced }); motionQueries.push(media);
      }
      return media;
    });
    await TestBed.configureTestingModule({ imports: [WhyHowellSectionComponent], providers: [provideZonelessChangeDetection(), provideRouter([{ path: '**', children: [] }])] }).compileComponents();
  });
  afterEach(() => { fixture?.destroy(); window.scrollTo(0, 0); frame.style.cssText = originalStyle; });

  it('renders the exact accessible copy, decorative photograph and one valid About link', async () => {
    await create();
    expect(root.querySelectorAll('h2').length).toBe(1); expect(root.querySelector('h1')).toBeNull();
    expect(root.querySelector('.why-eyebrow')?.textContent).toBe('WHY HOWELL');
    expect(root.querySelector('h2')?.textContent).toBe("The owner's vision is the measure of every decision.");
    expect(root.querySelector('.why-body')?.textContent).toBe('We bring experienced leadership to the table early\u2014building people-centric teams, asking better questions, and turning complexity into a clear path forward.');
    expect(root.querySelectorAll('a').length).toBe(1);
    expect(root.querySelector('a')?.getAttribute('href')).toBe('/about');
    expect(root.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(root.querySelector('.why-drawing')?.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('img')?.getAttribute('width')).toBe('1400');
    expect(root.textContent).not.toContain('?');
  });

  it('fits all requested viewport widths with a two-line desktop heading and copy-first mobile layout', async () => {
    await create();
    for (const width of [1600,1440,1280,1024,768,430,390,360]) {
      frame.style.width = `${width}px`; await tick(); await render();
      expect(window.innerWidth).toBe(width);
      expect(document.documentElement.scrollWidth).withContext(`${width}px overflow`).toBeLessThanOrEqual(width);
      const image = root.querySelector('.why-image-mask')!.getBoundingClientRect();
      const copy = root.querySelector('.why-copy')!.getBoundingClientRect();
      const link = root.querySelector('a')!.getBoundingClientRect();
      expect(link.height).toBeGreaterThanOrEqual(44); expect(link.right).toBeLessThanOrEqual(width);
      if (width < 768) {
        expect(image.top).toBeGreaterThanOrEqual(copy.bottom - 1);
        expect(image.width / image.height).toBeCloseTo(4/3, 2);
      } else {
        expect(image.left).toBe(0); expect(image.width / width).toBeCloseTo(.4, 2);
        expect(root.querySelector('section')!.getBoundingClientRect().height).toBeGreaterThanOrEqual(650);
        const lineHeight = parseFloat(getComputedStyle(root.querySelector('h2')!).lineHeight);
        for (const line of root.querySelectorAll('.heading-mask > span')) expect(line.getBoundingClientRect().height).withContext(`${width}px headline`).toBeLessThanOrEqual(lineHeight+1);
      }
    }
  });

  it('plays one unpinned timeline, in order, and does not replay when scrolling back', async () => {
    await create(false, 1200);
    const trigger = ScrollTrigger.getAll().find(t => t.trigger === root)!;
    expect(trigger).toBeDefined(); expect(trigger.vars.pin).toBeUndefined(); expect(trigger.vars.once).toBeTrue();
    const timeline = trigger.animation!;
    expect(timeline.duration()).toBeGreaterThanOrEqual(1.1); expect(timeline.duration()).toBeLessThanOrEqual(1.6);
    expect(root.querySelector<HTMLElement>('.why-link')!.style.opacity).toBe('0');
    window.scrollTo(0, 850); ScrollTrigger.update();
    await new Promise(resolve => setTimeout(resolve, 1700));
    expect(timeline.progress()).toBe(1);
    expect(getComputedStyle(root.querySelector('.why-link')!).opacity).toBe('1');
    expect(getComputedStyle(root.querySelector('.drawing-path')!).strokeDashoffset).toBe('0px');
    window.scrollTo(0, 0); ScrollTrigger.update(); await tick();
    window.scrollTo(0, 850); ScrollTrigger.update(); await tick();
    expect(timeline.progress()).toBe(1);
    fixture.destroy();
    expect(ScrollTrigger.getAll().some(t => t.trigger === root)).toBeFalse();
  });

  it('shows reduced-motion content immediately and safely handles a preference change mid-reveal', async () => {
    await create();
    expect(ScrollTrigger.getAll().some(t => t.trigger === root)).toBeFalse();
    expect(getComputedStyle(root.querySelector('.why-link')!).opacity).toBe('1');
    fixture.destroy(); await create(false, 1200);
    expect(root.querySelector<HTMLElement>('.why-link')!.style.opacity).toBe('0');
    reduced = true; motionQueries.forEach(media => media.dispatchEvent(new Event('change'))); await render();
    expect(ScrollTrigger.getAll().some(t => t.trigger === root)).toBeFalse();
    expect(root.querySelector<HTMLElement>('.why-link')!.style.opacity).toBe('');
    expect(root.querySelector<HTMLElement>('.why-image-mask')!.style.clipPath).toBe('');
  });

  it('makes the CTA visible on keyboard focus and navigates through Angular', async () => {
    await create(false, 1200);
    const link = root.querySelector<HTMLAnchorElement>('a')!;
    link.focus(); await render();
    expect(document.activeElement).toBe(link);
    expect(getComputedStyle(link).opacity).toBe('1');
    expect(ScrollTrigger.getAll().some(t => t.trigger === root)).toBeFalse();
    link.click(); await render(); expect(TestBed.inject(Router).url).toBe('/about');
  });

  it('retains the readable default if animation initialization fails', async () => {
    spyOn(TestBed.inject(AnimationManagerService), 'createContext').and.throwError('Animation unavailable');
    await create(false);
    expect(getComputedStyle(root.querySelector('.why-link')!).opacity).toBe('1');
    expect(root.querySelector<HTMLElement>('.why-image-mask')!.style.clipPath).toBe('');
  });
});

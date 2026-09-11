import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PeopleBeforeProcessComponent } from './people-before-process.component';

describe('People Before Process', () => {
  let fixture: ComponentFixture<PeopleBeforeProcessComponent>;
  let reduced: boolean;
  let queries: MediaQueryList[];
  let frame: HTMLElement;
  let original: string;
  const tick = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  const create = async () => { fixture = TestBed.createComponent(PeopleBeforeProcessComponent); fixture.nativeElement.style.marginTop = '2000px'; fixture.detectChanges(); await fixture.whenStable(); };
  beforeEach(async () => {
    reduced = true; queries = [];
    frame = window.frameElement as HTMLElement; original = frame.style.cssText;
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const media = match(query);
      if (query.includes('prefers-reduced-motion')) { Object.defineProperty(media, 'matches', { get: () => reduced }); queries.push(media); }
      return media;
    });
    await TestBed.configureTestingModule({ imports: [PeopleBeforeProcessComponent], providers: [provideZonelessChangeDetection(), provideRouter([{path:'about',children:[]}])] }).compileComponents();
  });
  afterEach(() => { fixture?.destroy(); frame.style.cssText = original; });
  it('renders exact semantic content, a valid link and a dimensioned atmospheric image', async () => {
    await create(); const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('h2')?.textContent).toBe('Great projects are built by teams that see the whole picture.');
    expect(root.querySelector('.people-body')?.textContent).toBe('Decades of design-build and owner-side experience have taught us that successful outcomes begin with trust, clarity and a shared mission.');
    expect(root.querySelector('.founder-line')?.textContent).toBe('Founded by Marc Howell and Eric Laurin.');
    expect(root.querySelector('a')?.getAttribute('href')).toBe('/about');
    expect(root.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(root.querySelector('img')?.getAttribute('width')).toBe('1600');
    expect(root.querySelector('.people-image-mask')?.getAttribute('style')).toBeNull();
    expect(ScrollTrigger.getAll().some(trigger => trigger.trigger === root)).toBeFalse();
  });
  it('preserves the split, mobile order, reserved image space and touch targets at requested widths', async () => {
    await create(); const root: HTMLElement = fixture.nativeElement;
    for (const width of [1600,1440,1280,1024,900,768,430,390,360]) {
      frame.style.width = `${width}px`; await tick();
      const copy = root.querySelector('.people-copy')!.getBoundingClientRect();
      const image = root.querySelector('.people-image-mask')!.getBoundingClientRect();
      expect(root.scrollWidth).withContext(`${width}px overflow`).toBeLessThanOrEqual(width);
      expect(root.querySelector('a')!.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
      if (width < 768) { expect(image.top).toBeGreaterThanOrEqual(copy.bottom); expect(image.width/image.height).toBeCloseTo(4/3, 2); }
      else { expect(image.left).toBeCloseTo(root.getBoundingClientRect().width*.53, 0); expect(image.height).toBeGreaterThan(0); }
    }
  });
  it('uses one unpinned 1.37-second timeline and restores the final state on reduced motion', async () => {
    reduced = false; await create(); const root: HTMLElement = fixture.nativeElement;
    const trigger = ScrollTrigger.getAll().find(candidate => candidate.trigger === root)!;
    expect(trigger).toBeDefined(); expect(trigger.vars.pin).toBeUndefined();
    expect(trigger.animation!.duration()).toBeCloseTo(1.37, 2);
    trigger.animation!.progress(.5);
    expect((root.querySelector('.people-image-mask') as HTMLElement).style.clipPath).toContain('inset');
    reduced = true; queries.forEach(query => query.dispatchEvent(new Event('change')));
    expect((root.querySelector('.people-image-mask') as HTMLElement).style.clipPath).toBe('');
    expect((root.querySelector('.people-image') as HTMLElement).style.transform).toBe('');
    expect(ScrollTrigger.getAll().some(candidate => candidate.trigger === root)).toBeFalse();
  });
  it('reveals keyboard-focused content immediately and cleans up on revisit', async () => {
    reduced = false; await create(); const root: HTMLElement = fixture.nativeElement;
    root.querySelector('a')!.dispatchEvent(new FocusEvent('focusin', {bubbles:true}));
    expect((root.querySelector('a') as HTMLElement).style.opacity).toBe('');
    fixture.destroy();
    expect(ScrollTrigger.getAll().some(candidate => candidate.trigger === root)).toBeFalse();
    await create();
    expect(ScrollTrigger.getAll().filter(candidate => candidate.trigger === fixture.nativeElement).length).toBe(1);
  });
});

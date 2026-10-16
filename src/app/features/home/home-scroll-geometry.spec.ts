import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { HomePageComponent } from './home-page.component';

// Exercise the complete section ordering, rather than an isolated pinned card.
describe('Homepage scroll geometry', () => {
  it('keeps Projects and Services aligned after enhancement and upstream height changes', async () => {
    const frame = window.frameElement as HTMLElement;
    const originalStyle = frame.style.cssText;
    frame.style.width = '1440px';
    frame.style.height = '1000px';
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake((query) => {
      const media = match(query);
      if (query.includes('prefers-reduced-motion'))
        Object.defineProperty(media, 'matches', {
          value: query.includes('no-preference'),
        });
      return media;
    });
    spyOn(HTMLMediaElement.prototype, 'play').and.returnValue(
      Promise.resolve(),
    );
    spyOn(HTMLMediaElement.prototype, 'pause');
    spyOn(HTMLMediaElement.prototype, 'load');
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      for (let i = 0; i < 5; i++)
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
    };
    try {
      await settle();
      const root = fixture.nativeElement as HTMLElement;
      const featured = root.querySelector<HTMLElement>('.featured__stage')!;
      const services = root.querySelector<HTMLElement>('.services-viewport')!;
      const projectTrigger = ScrollTrigger.getAll().find(
        (t) => t.trigger === featured,
      )!;
      const serviceTrigger = ScrollTrigger.getAll().find(
        (t) => t.trigger === services,
      )!;
      expect(projectTrigger).toBeDefined();
      expect(serviceTrigger).toBeDefined();
      const aligned = () => {
        for (const [stage, trigger] of [
          [featured, projectTrigger],
          [services, serviceTrigger],
        ] as const) {
          const actualStart =
            stage.parentElement!.getBoundingClientRect().top + window.scrollY;
          expect(Math.abs(trigger.start - actualStart))
            .withContext(stage.className + ' start')
            .toBeLessThan(2);
        }
        const expectedProjectEnd =
          projectTrigger.start + window.innerHeight * 5 * 1.15;
        expect(projectTrigger.end).toBeCloseTo(expectedProjectEnd, 0);
      };
      aligned();
      const previousStart = projectTrigger.start;
      root.querySelector<HTMLElement>('app-home-hero')!.style.paddingBottom =
        '320px';
      await settle();
      expect(projectTrigger.start - previousStart).toBeCloseTo(320, 0);
      aligned();
    } finally {
      fixture.destroy();
      frame.style.cssText = originalStyle;
    }
  });
});

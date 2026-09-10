import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FeaturedProjectsComponent, activeProjectIndex } from './featured-projects.component';
import { FEATURED_PROJECT_SAMPLES } from './featured-projects.data';

describe('FeaturedProjectsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProjectsComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
  });

  it('maps both scroll directions to stable, bounded project indices', () => {
    expect([0, .25, .5, .75, 1].map(p => activeProjectIndex(p, 5))).toEqual([0, 1, 2, 3, 4]);
    expect([1, .75, .5, .25, 0].map(p => activeProjectIndex(p, 5))).toEqual([4, 3, 2, 1, 0]);
    expect(activeProjectIndex(-1, 5)).toBe(0);
    expect(activeProjectIndex(2, 5)).toBe(4);
    expect(activeProjectIndex(.5, 1)).toBe(0);
  });

  it('renders complete project information and labels illustrative data', async () => {
    const fixture = TestBed.createComponent(FeaturedProjectsComponent);
    fixture.componentRef.setInput('projects', FEATURED_PROJECT_SAMPLES);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('article').length).toBe(5);
    const text = root.querySelector('article')!.textContent!;
    for (const value of ['Riverside Medical Center', 'Los Angeles', 'Healthcare', '185,000 SF', '2025', 'Completed', 'sample data']) {
      expect(text).toContain(value);
    }
    expect(root.querySelectorAll('img[loading="eager"]').length).toBeGreaterThanOrEqual(2);
    fixture.destroy();
  });

  it('creates a reversible pinned timeline and removes its spacer on destruction', async () => {
    const originalMatch = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const result = originalMatch(query);
      if (query === '(min-height: 520px)' || query === '(prefers-reduced-motion: no-preference)') {
        Object.defineProperty(result, 'matches', { value: true });
      }
      return result;
    });
    const before = ScrollTrigger.getAll().length;
    const fixture = TestBed.createComponent(FeaturedProjectsComponent);
    fixture.componentRef.setInput('projects', FEATURED_PROJECT_SAMPLES);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = ScrollTrigger.getAll().find(item => item.trigger === root.querySelector('.featured__stage'))!;
    expect(trigger).toBeDefined();
    expect(trigger.vars.pin).toBeTrue();
    expect(trigger.vars.scrub).toBeTrue();
    expect(root.querySelector('.pin-spacer')).not.toBeNull();
    const cards = root.querySelectorAll<HTMLElement>('article');
    const timeline = trigger.animation!;
    timeline.progress(1);
    expect(Number(gsap.getProperty(cards[0], 'opacity'))).toBe(0);
    expect(Number(gsap.getProperty(cards[4], 'scaleX'))).toBeCloseTo(1);
    timeline.progress(.55);
    const middle = Number(gsap.getProperty(cards[2], 'y'));
    timeline.progress(.95);
    timeline.progress(.55);
    expect(Number(gsap.getProperty(cards[2], 'y'))).toBeCloseTo(middle);
    timeline.progress(0);
    expect(Number(gsap.getProperty(cards[0], 'opacity'))).toBe(1);
    expect(Number(gsap.getProperty(cards[0], 'scaleX'))).toBeCloseTo(1);
    ScrollTrigger.refresh();
    expect(Number.isFinite(trigger.end)).toBeTrue();
    expect(trigger.end).toBeGreaterThan(trigger.start);
    // Keyboard-accessible list mode removes pinning without discarding content.
    root.querySelector<HTMLButtonElement>('.featured__intro-copy button')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.classList.contains('is-stacked')).toBeFalse();
    expect(root.querySelectorAll('article').length).toBe(5);
    expect(root.querySelector('.pin-spacer')).toBeNull();
    fixture.destroy();
    expect(ScrollTrigger.getAll().length).toBe(before);
    expect(root.querySelector('.pin-spacer')).toBeNull();
  });

  it('keeps every project readable with reduced motion and handles empty data', async () => {
    const originalMatch = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const result = originalMatch(query);
      if (query === '(prefers-reduced-motion: no-preference)') Object.defineProperty(result, 'matches', { value: false });
      return result;
    });
    const fixture = TestBed.createComponent(FeaturedProjectsComponent);
    fixture.componentRef.setInput('projects', FEATURED_PROJECT_SAMPLES);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.classList.contains('is-stacked')).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('article').length).toBe(5);
    fixture.componentRef.setInput('projects', []);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('article').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('published here shortly');
    fixture.destroy();
  });
});

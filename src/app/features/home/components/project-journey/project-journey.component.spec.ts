import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ProjectJourneyComponent } from './project-journey.component';

describe('Project journey scroll experience', () => {
  it('assembles the scene, advances and reverses phases, then removes its pin on destruction', async () => {
    const frame = window.frameElement as HTMLElement;
    const oldStyle = frame.style.cssText;
    frame.style.width = '1440px'; frame.style.height = '1000px';
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const result = match(query);
      if (query.includes('prefers-reduced-motion') || query.includes('max-height')) Object.defineProperty(result, 'matches', { value: false });
      return result;
    });
    await TestBed.configureTestingModule({ imports: [ProjectJourneyComponent], providers: [provideZonelessChangeDetection(), provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(ProjectJourneyComponent);
    const root = fixture.nativeElement as HTMLElement;
    const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    try {
      fixture.detectChanges(); await fixture.whenStable();
      const followingSection = document.createElement('div');
      followingSection.style.height = '100vh';
      root.appendChild(followingSection);
      root.scrollIntoView();
      for (let i = 0; i < 180 && !ScrollTrigger.getById('project-journey'); i++) await nextFrame();
      const trigger = ScrollTrigger.getById('project-journey');
      expect(trigger).withContext('WebGL scene initialized and pinned').toBeDefined();
      if (!trigger) return;
      expect(root.querySelector('canvas')).toBeTruthy();
      expect(trigger.end - trigger.start).toBeCloseTo(window.innerHeight * 6.4, 0);
      const stage = root.querySelector<HTMLElement>('.journey')!;
      expect(stage.offsetHeight).toBeCloseTo(window.innerHeight, 0);
      for (const phase of [0, 3, 5, 7, 2]) {
        trigger.scroll(trigger.start + (trigger.end - trigger.start) * ((phase + .2) / 8));
        ScrollTrigger.update(); trigger.getTween()?.progress(1);
        fixture.detectChanges(); await nextFrame();
        expect(root.querySelector('.journey__chapter.is-active h3')?.textContent).toBe([
          'Project Development', 'Team Development', 'Design', 'Agency Review', 'Preconstruction', 'Construction', 'Close Out', 'Operation / Patient Ready'
        ][phase]);
      }
      trigger.scroll(trigger.end + 100); ScrollTrigger.update();
      expect(stage.getBoundingClientRect().top).toBeLessThan(0);
    } finally {
      fixture.destroy(); frame.style.cssText = oldStyle;
    }
    expect(ScrollTrigger.getById('project-journey')).toBeUndefined();
    expect(root.querySelector('canvas')).toBeNull();
  }, 20000);
});

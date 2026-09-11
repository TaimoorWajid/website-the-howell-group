import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ServicesExperienceComponent } from './services-experience.component';
import { HOWELL_SERVICE_STAGES, layerPose, SERVICE_LAYERS, serviceBuildingParts, serviceStageIndex } from './services-experience.data';

describe('Services experience', () => {
  let fixture: ComponentFixture<ServicesExperienceComponent>;
  let frame: HTMLElement;
  let style: string;
  const tick = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  beforeEach(async () => {
    frame = window.frameElement as HTMLElement; style = frame.style.cssText;
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const result = match(query);
      if (query.includes('prefers-reduced-motion')) Object.defineProperty(result, 'matches', { value: false });
      return result;
    });
    await TestBed.configureTestingModule({ imports: [ServicesExperienceComponent], providers: [provideZonelessChangeDetection(), provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(ServicesExperienceComponent); fixture.detectChanges(); await fixture.whenStable();
  });
  afterEach(() => { fixture.destroy(); frame.style.cssText = style; });
  it('renders all exact service content, safe destinations and an immediate reduced-motion fallback', () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('a').length).toBe(4);
    HOWELL_SERVICE_STAGES.forEach(stage => { expect(root.textContent).toContain(stage.title); expect(root.textContent).toContain(stage.description); });
    root.querySelectorAll('a').forEach(link => expect(link.getAttribute('href')).toBe('/services'));
    expect(fixture.componentInstance.activeServiceIndex()).toBe(0);
    expect(root.querySelector('canvas')).toBeNull();
    expect(root.querySelector('img')?.getAttribute('src')).toContain('coordinated-building.svg');
    expect(ScrollTrigger.getAll().filter(trigger => root.contains(trigger.trigger!)).length).toBe(0);
  });
  it('fits every requested width with readable descriptions and touch targets', async () => {
    const root: HTMLElement = fixture.nativeElement;
    for (const width of [1600,1440,1280,1024,900,768,430,390,360]) {
      frame.style.width = `${width}px`; await tick();
      expect(root.scrollWidth).withContext(`${width}px`).toBeLessThanOrEqual(width);
      root.querySelectorAll('a').forEach(link => { expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44); expect(link.getBoundingClientRect().right).toBeLessThanOrEqual(width); });
      root.querySelectorAll('.service-description').forEach(copy => expect(getComputedStyle(copy).display).not.toBe('none'));
    }
  });
  it('previews focus and restores the current scroll stage after leaving', () => {
    fixture.componentInstance.preview(2, 'focus'); expect(fixture.componentInstance.activeServiceIndex()).toBe(2);
    fixture.componentInstance.preview(1, 'hover'); expect(fixture.componentInstance.activeServiceIndex()).toBe(2);
    fixture.componentInstance.preview(null, 'focus'); expect(fixture.componentInstance.activeServiceIndex()).toBe(1);
    fixture.componentInstance.preview(null, 'hover'); expect(fixture.componentInstance.activeServiceIndex()).toBe(0);
  });
  it('has stable reversible stage thresholds and fully aligned final layers', () => {
    expect([0,.249,.25,.499,.5,.749,.75,1].map(serviceStageIndex)).toEqual([0,0,1,1,2,2,3,3]);
    expect([1,.75,.5,.25,0].map(serviceStageIndex)).toEqual([3,3,2,1,0]);
    for (const layer of SERVICE_LAYERS) {
      expect(serviceBuildingParts().some(part => part.layer === layer)).toBeTrue();
      expect(layerPose(layer, 1)).toEqual({ opacity: .78, y: 0, x: 0 });
    }
    expect(layerPose('structure', .5).opacity).toBe(.78);
    expect(layerPose('design', .25).opacity).toBe(.78);
    expect(layerPose('site', 0).opacity).toBe(.78);
  });
});

describe('Services desktop scroll lifecycle', () => {
  it('pins only its viewport, reverses from one timeline and removes its pin on destroy', async () => {
    const frame = window.frameElement as HTMLElement;
    const original = frame.style.cssText;
    frame.style.width = '1440px'; frame.style.height = '900px';
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await TestBed.configureTestingModule({ imports: [ServicesExperienceComponent], providers: [provideZonelessChangeDetection(), provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(ServicesExperienceComponent);
    const root: HTMLElement = fixture.nativeElement;
    root.style.marginTop = '10000px';
    try {
      fixture.detectChanges(); await fixture.whenStable();
      const viewport = root.querySelector('.services-viewport')!;
      const trigger = ScrollTrigger.getAll().find(candidate => candidate.trigger === viewport)!;
      expect(trigger).toBeDefined(); expect(trigger.vars.pin).toBeTrue(); expect(trigger.vars.pinSpacing).toBeTrue();
      for (const progress of [0,.26,.51,.76,1,.76,.51,.26,0]) {
        trigger.animation!.progress(progress);
        expect(fixture.componentInstance.activeServiceIndex()).toBe(serviceStageIndex(progress));
      }
      expect(trigger.end - trigger.start).toBeCloseTo(window.innerHeight * 3, 0);
      fixture.destroy();
      expect(ScrollTrigger.getAll().some(candidate => candidate.trigger === viewport)).toBeFalse();
      expect(root.querySelector('.pin-spacer')).toBeNull();
    } finally { fixture.destroy(); frame.style.cssText = original; }
  });
});

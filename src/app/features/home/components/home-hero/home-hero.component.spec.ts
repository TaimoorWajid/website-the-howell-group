import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeHeroComponent } from './home-hero.component';

describe('Homepage video hero', () => {
  let fixture: ComponentFixture<HomeHeroComponent>;
  let root: HTMLElement;
  let reduced: boolean;
  let motionListener: EventListener;
  let play: jasmine.Spy;
  let pause: jasmine.Spy;
  const render = async () => { fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges(); };

  beforeEach(async () => {
    reduced = true;
    play = spyOn(HTMLMediaElement.prototype, 'play').and.returnValue(Promise.resolve());
    pause = spyOn(HTMLMediaElement.prototype, 'pause');
    spyOn(HTMLMediaElement.prototype, 'load');
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const media = match(query);
      if (query.includes('prefers-reduced-motion')) {
        Object.defineProperty(media, 'matches', { get: () => reduced });
        spyOn(media, 'addEventListener').and.callFake((_type: string, listener: EventListenerOrEventListenerObject) => { motionListener = listener as EventListener; });
      }
      return media;
    });
    await TestBed.configureTestingModule({ imports: [HomeHeroComponent], providers: [provideZonelessChangeDetection(), provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(HomeHeroComponent);
    root = fixture.nativeElement;
    await render();
  });
  afterEach(() => fixture.destroy());

  it('preserves the approved headline and navigation targets', () => {
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('h1')?.textContent).toBe('We Deliver Your Mission');
    expect(Array.from(root.querySelectorAll('a')).map(a => a.getAttribute('href'))).toEqual(['/projects', '/contact']);
    expect(root.querySelector('img')?.getAttribute('src')).toBe('/images/hero/howell-hero-poster.jpg');
  });

  it('does not request or autoplay video for reduced-motion users', () => {
    expect(root.querySelector('video')?.getAttribute('src')).toBeNull();
    expect(play).not.toHaveBeenCalled();
    expect(root.querySelector('.hero-media')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('allows explicit playback and pause with an accurate accessible label', async () => {
    const video = root.querySelector('video')!;
    root.querySelector<HTMLButtonElement>('button')!.click();
    expect(play).toHaveBeenCalled();
    expect(video.muted).toBeTrue();
    expect(video.loop).toBeTrue();
    expect(video.playsInline).toBeTrue();
    video.dispatchEvent(new Event('playing')); await render();
    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Pause background video');
    root.querySelector<HTMLButtonElement>('button')!.click();
    expect(pause).toHaveBeenCalled();
    video.dispatchEvent(new Event('pause')); await render();
    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Play background video');
  });

  it('pauses when reduced motion is enabled during playback', () => {
    reduced = false; motionListener(new Event('change'));
    expect(play).toHaveBeenCalled();
    pause.calls.reset(); reduced = true; motionListener(new Event('change'));
    expect(pause).toHaveBeenCalled();
  });

  it('keeps the still image and both links when media fails', async () => {
    root.querySelector('video')!.dispatchEvent(new Event('error')); await render();
    expect(root.querySelector('.hero-video.is-ready')).toBeNull();
    expect(root.querySelector('img')).not.toBeNull();
    expect(root.querySelector('button')).toBeNull();
    expect(root.querySelectorAll('a').length).toBe(2);
  });

  it('releases the media source when leaving the page', () => {
    root.querySelector<HTMLButtonElement>('button')!.click();
    const video = root.querySelector('video')!;
    fixture.destroy();
    expect(video.getAttribute('src')).toBeNull();
    expect(pause).toHaveBeenCalled();
  });
});

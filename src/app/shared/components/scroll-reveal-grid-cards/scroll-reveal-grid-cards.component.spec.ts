import { provideZonelessChangeDetection } from '@angular/core';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { revealAmount, ScrollRevealCard, ScrollRevealGridCardsComponent } from './scroll-reveal-grid-cards.component';

@Component({ imports: [ScrollRevealGridCardsComponent], template: `<app-scroll-reveal-grid-cards [cards]="cards" />` })
class HostComponent { protected readonly cards: readonly ScrollRevealCard[] = [{ title: 'One', description: 'A card.' }, { title: 'Two', description: 'Another card.' }]; }

describe('ScrollRevealGridCardsComponent', () => {
  it('starts empty and finishes with every panel visible', () => {
    for (let index = 0; index < 4; index++) {
      expect(revealAmount(0, index, 4)).toBe(0);
      expect(revealAmount(1, index, 4)).toBe(1);
    }
  });

  it('reveals from left to right instead of revealing an entire row together', () => {
    expect(revealAmount(.3, 0, 4)).toBeGreaterThan(revealAmount(.3, 1, 4));
    expect(revealAmount(.3, 2, 4)).toBe(0);
    expect(revealAmount(.3, 3, 4)).toBe(0);
  });

  it('reverses deterministically and clamps overscroll', () => {
    const middle = revealAmount(.35, 1, 4);
    expect(revealAmount(.8, 1, 4)).toBeGreaterThan(middle);
    expect(revealAmount(.35, 1, 4)).toBe(middle);
    expect(revealAmount(-1, 0, 1)).toBe(0);
    expect(revealAmount(2, 0, 1)).toBe(1);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
  });

  it('renders the supplied card data and scroll cue', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.scroll-grid__label')?.textContent).toContain('Scroll below to see effect');
    expect(element.querySelectorAll('[data-reveal-card]').length).toBe(2);
    expect(element.querySelector('h2')?.textContent).toContain('One');
  });

  it('supports replacing input data after creation, including duplicate titles', () => {
    const fixture = TestBed.createComponent(ScrollRevealGridCardsComponent);
    fixture.componentRef.setInput('cards', [{ title: 'Same', description: 'First' }]);
    fixture.detectChanges();
    fixture.componentRef.setInput('cards', [
      { title: 'Same', description: 'First' },
      { title: 'Same', description: 'Second' }
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[data-reveal-card]').length).toBe(2);
    fixture.componentRef.setInput('cards', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[data-scroll-row]').length).toBe(0);
    fixture.destroy();
  });

  it('caps supplied data at four cards in one desktop row', () => {
    const fixture = TestBed.createComponent(ScrollRevealGridCardsComponent);
    fixture.nativeElement.style.width = '1200px';
    fixture.componentRef.setInput('cards', Array.from({ length: 6 }, (_, i) => ({
      title: 'Card ' + i, description: 'Description'
    })));
    fixture.detectChanges();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[data-reveal-card]').length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('[data-scroll-row]').length).toBe(1);
    fixture.destroy();
  });

  it('holds the stage through its runway, releases afterward, and pins on return', () => {
    const fixture = TestBed.createComponent(ScrollRevealGridCardsComponent);
    fixture.nativeElement.style.width = '1200px';
    fixture.componentRef.setInput('cards', [{ title: 'One', description: 'A card.' }]);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const section = host.querySelector<HTMLElement>('.scroll-grid')!;
    section.classList.add('scroll-grid--enhanced');
    const runway = host.querySelector<HTMLElement>('[data-scroll-row]')!;
    const stage = host.querySelector<HTMLElement>('.scroll-grid__stage')!;
    const scroller = document.createElement('div');
    scroller.style.cssText = 'height: 100vh; overflow: auto; width: 1200px;';
    const tail = document.createElement('div');
    tail.style.height = '100vh';
    host.parentElement!.insertBefore(scroller, host);
    scroller.append(host, tail);
    try {
      const origin = stage.getBoundingClientRect().top;
      const travel = runway.offsetHeight - stage.offsetHeight;
      expect(travel).toBeGreaterThan(window.innerHeight);
      scroller.scrollTop = travel * .5;
      expect(Math.abs(stage.getBoundingClientRect().top - origin)).toBeLessThan(2);
      scroller.scrollTop = travel * .9;
      expect(Math.abs(stage.getBoundingClientRect().top - origin)).toBeLessThan(2);
      scroller.scrollTop = travel + 80;
      expect(stage.getBoundingClientRect().top).toBeLessThan(origin - 50);
      scroller.scrollTop = travel * .5;
      expect(Math.abs(stage.getBoundingClientRect().top - origin)).toBeLessThan(2);
    } finally {
      fixture.destroy();
      scroller.remove();
    }
  });
});

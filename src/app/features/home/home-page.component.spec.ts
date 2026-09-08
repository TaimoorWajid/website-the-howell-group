import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HomePageComponent], providers: [provideZonelessChangeDetection(), provideRouter(routes)] }).compileComponents();
  });

  it('renders the homepage section structure', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('#hero-title')).toBeTruthy();
    expect(page.querySelector('#projects-title')).toBeTruthy();
    expect(page.querySelector('#services-title')).toBeTruthy();
    expect(page.querySelector('#cta-title')).toBeTruthy();
  });
});

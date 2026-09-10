import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { HomePageComponent } from './home-page.component';
import { of } from 'rxjs';
import { InsightApiService } from '../../core/api/insight-api.service';
import { ProjectApiService } from '../../core/api/project-api.service';

describe('HomePageComponent', () => {
  beforeEach(async () => {
    const match = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake(query => {
      const media = match(query);
      if (query.includes('prefers-reduced-motion')) Object.defineProperty(media, 'matches', { value: true });
      return media;
    });
    await TestBed.configureTestingModule({ imports: [HomePageComponent], providers: [provideZonelessChangeDetection(), provideRouter(routes),
      { provide: InsightApiService, useValue: { getInsights: () => of([]) } },
      { provide: ProjectApiService, useValue: { getProjects: () => of([]) } }
    ] }).compileComponents();
  });

  it('renders the homepage section structure', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('#hero-title')).toBeTruthy();
    expect(page.querySelector('#why-howell-title')).toBeTruthy();
    expect(page.querySelector('app-home-hero')?.nextElementSibling?.tagName.toLowerCase()).toBe('app-why-howell-section');
    expect(page.querySelector('app-why-howell-section')?.nextElementSibling?.tagName.toLowerCase()).toBe('app-scroll-reveal-grid-cards');
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(page.querySelector('app-featured-projects h2')).toBeTruthy();
    expect(page.querySelector('app-scroll-reveal-grid-cards')).toBeTruthy();
    expect(page.querySelector('#services-title')).toBeTruthy();
    expect(page.querySelector('#cta-title')).toBeTruthy();
  });
});

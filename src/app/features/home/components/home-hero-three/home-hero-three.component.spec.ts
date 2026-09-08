import { TestBed } from '@angular/core/testing';
import { HomeHeroThreeComponent } from './home-hero-three.component';

describe('HomeHeroThreeComponent', () => {
  it('creates the canvas host', async () => {
    await TestBed.configureTestingModule({ imports: [HomeHeroThreeComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HomeHeroThreeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

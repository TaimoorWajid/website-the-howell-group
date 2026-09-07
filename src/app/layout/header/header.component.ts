import { Component, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

@Component({ selector: 'app-header', imports: [RouterLink], template: `
  <header class="site-header"><a class="brand" routerLink="/" aria-label="The Howell Group home">The Howell Group</a>
    <nav aria-label="Primary navigation">@for (link of links; track link.path) { <a [routerLink]="link.path">{{ link.label }}</a> }</nav>
    <button class="menu-button" type="button" aria-label="Open navigation" aria-controls="primary-navigation" (click)="menuOpen = !menuOpen" [attr.aria-expanded]="menuOpen">Menu</button>
  </header>
  @if (menuOpen) { <div id="primary-navigation" class="mobile-navigation" role="dialog" aria-label="Mobile navigation">@for (link of links; track link.path) { <a [routerLink]="link.path" (click)="menuOpen = false">{{ link.label }}</a> }</div> }
`, styles: [`:host { display: block; position: relative; z-index: 10; } .site-header { align-items: center; display: flex; gap: 2rem; justify-content: space-between; padding: 1.25rem var(--page-gutter); } .brand { color: var(--color-charcoal); font-family: var(--font-display); font-size: 1rem; letter-spacing: .08em; text-decoration: none; text-transform: uppercase; } nav { display: flex; gap: 1.5rem; } nav a, .mobile-navigation a { color: var(--color-charcoal); font-size: .75rem; letter-spacing: .12em; text-decoration: none; text-transform: uppercase; } .menu-button { background: transparent; border: 1px solid var(--color-charcoal); color: var(--color-charcoal); cursor: pointer; display: none; padding: .65rem .8rem; } .mobile-navigation { background: var(--color-off-white); display: grid; gap: 1rem; padding: 1.5rem var(--page-gutter) 2rem; } @media (max-width: 48rem) { nav { display: none; } .menu-button { display: block; } }` ] })
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private readonly smoothScroll = inject(SmoothScrollService); protected menuOpen = false;
  protected readonly links = [{ path: '/projects', label: 'Projects' }, { path: '/services', label: 'Services' }, { path: '/about', label: 'About' }, { path: '/insights', label: 'Insights' }, { path: '/contact', label: 'Contact' }];
  ngAfterViewInit(): void { this.smoothScroll.initialize(); }
  ngOnDestroy(): void { this.smoothScroll.destroy(); }
}

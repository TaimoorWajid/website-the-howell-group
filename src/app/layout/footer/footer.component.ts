import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-footer', imports: [RouterLink], template: `<footer><p>© {{ year }} The Howell Group</p><a routerLink="/contact">Start a conversation</a></footer>`, styles: [`footer { align-items: center; border-top: 1px solid var(--color-line); display: flex; justify-content: space-between; margin: 4rem var(--page-gutter) 0; padding: 1.5rem 0; } footer a { color: var(--color-charcoal); font-size: .75rem; letter-spacing: .1em; text-decoration: none; text-transform: uppercase; } p { color: var(--color-muted); font-size: .75rem; margin: 0; } @media (max-width: 48rem) { footer { align-items: flex-start; flex-direction: column; gap: 1rem; } }`] })
export class FooterComponent { protected readonly year = new Date().getFullYear(); }

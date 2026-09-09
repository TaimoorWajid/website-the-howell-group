import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `<footer><p>&copy; {{ year }} The Howell Group</p><a routerLink="/contact">Start a conversation</a></footer>`,
  styles: [`footer { align-items: center; background: var(--color-darkest-teal); border-top: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.5); display: flex; justify-content: space-between; margin: 0; padding: 1.5rem var(--page-gutter); } footer a { color: rgba(255,255,255,.5); font-size: .75rem; letter-spacing: .1em; text-decoration: none; text-transform: uppercase; } footer a:hover { color: var(--color-white); } p { color: inherit; font-size: .75rem; margin: 0; } @media (max-width: 48rem) { footer { align-items: flex-start; flex-direction: column; gap: 1rem; } }`]
})
export class FooterComponent { protected readonly year = new Date().getFullYear(); }

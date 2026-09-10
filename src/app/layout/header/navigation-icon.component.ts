import { Component, Input } from '@angular/core';

export const NAVIGATION_ICONS = {
  arrow: 'M5 19 19 5M5 5h14v14',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  layers: 'm12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  building: 'M4 21V7l8-4 8 4v14M2 21h20M9 21V11h6v10',
  blueprint: 'M3 3h18v18H3zM3 9h11V3M9 9v12M9 15h12M15 15v6',
  checklist: 'M9 5h12M9 12h12M9 19h12M2 5l2 2 3-4M2 12l2 2 3-4M2 19l2 2 3-4',
  development: 'M3 21h18M5 21V11h6v10M11 21V3h8v18M14 7h2M14 11h2M14 15h2',
  conversation: 'M21 11a8 8 0 0 1-8 8H8l-5 3V11a9 9 0 0 1 18 0ZM7 9h10M7 13h7',
  briefcase: 'M3 7h18v14H3zM8 7V3h8v4M3 12l9 3 9-3M10 12h4',
  journal: 'M4 3h16v18H4zM8 7h8M8 11h8M8 15h3M14 15h2M8 18h8',
  mail: 'M3 5h18v14H3zM3 5l9 8 9-8',
  compass: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM16 8l-2 6-6 2 2-6 6-2Z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'm5 5 14 14M5 19 19 5',
  menu: 'M3 7h18M3 17h18'
} as const;
export type NavigationIcon = keyof typeof NAVIGATION_ICONS;

/** Small, dependency-free line icons; no font glyphs or Unicode fallback. */
@Component({
  selector: 'app-navigation-icon',
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path [attr.d]="paths[name]" /></svg>',
  styles: [':host { display: inline-flex; width: 1.25rem; height: 1.25rem; flex: 0 0 auto; vertical-align: middle; } svg { display: block; width: 100%; height: 100%; }'],
  host: { 'aria-hidden': 'true' }
})
export class NavigationIconComponent {
  @Input() name: NavigationIcon = 'arrow';
  protected readonly paths = NAVIGATION_ICONS;
}

import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { REFERENCE_ROWS, type ReferenceLetter } from './references.data';

@Component({
  selector: 'app-references-page',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './references-page.component.html',
  styleUrl: './references-page.component.scss',
})
export class ReferencesPageComponent {
  readonly rows = REFERENCE_ROWS;

  /** Alt text for a letter image, from its signatories and company. */
  altFor(reference: ReferenceLetter): string {
    const names = reference.signatories.map((s) => s.name).join(' and ');
    return `Reference letter from ${names}, ${reference.company}`;
  }

  constructor() {
    inject(SeoService).update({
      title: 'References | The Howell Group',
      description:
        'What owners, builders and hospital leaders say about working with The Howell Group — reference letters from clients across Southern California healthcare projects.',
      canonicalPath: '/references',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'References', path: '/references' },
      ],
    });
  }
}

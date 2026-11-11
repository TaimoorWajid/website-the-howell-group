import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { REFERENCES } from './references.data';

@Component({
  selector: 'app-references-page',
  imports: [RouterLink],
  templateUrl: './references-page.component.html',
  styleUrl: './references-page.component.scss',
})
export class ReferencesPageComponent {
  readonly references = REFERENCES;

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

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ContactInquiry } from '../models/content.models';
import { APP_CONFIG } from '../config/app-config';

/**
 * Contact inquiries are sent to the Cloudflare Worker (email via Resend),
 * NOT to the WordPress CMS endpoint. Every other CMS read in the app is
 * untouched — only this submit was repointed.
 */
@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);

  submitInquiry(inquiry: ContactInquiry): Observable<void> {
    return this.http
      .post<{ ok: boolean }>(APP_CONFIG.formEndpoint, inquiry)
      .pipe(map(() => undefined));
  }
}

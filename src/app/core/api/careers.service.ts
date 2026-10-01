import { inject, Injectable, REQUEST, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import {
  ApplicationReceipt,
  CareersCatalog,
  JobApplication,
} from '../models/careers.models';

@Injectable({ providedIn: 'root' })
export class CareersService {
  private readonly http = inject(HttpClient);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly base = `${this.request ? new URL(this.request.url).origin : ''}/api/careers`;
  readonly receipt = signal<ApplicationReceipt | null>(null);
  getCatalog() {
    return this.http.get<CareersCatalog>(this.base).pipe(timeout(15000));
  }
  apply(application: JobApplication) {
    return this.http
      .post<ApplicationReceipt>(`${this.base}/applications`, application)
      .pipe(timeout(45000));
  }
}

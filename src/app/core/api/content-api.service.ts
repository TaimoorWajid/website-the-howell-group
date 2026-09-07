import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class ContentApiService {
  private readonly http = inject(HttpClient);

  protected collection<T>(resource: string): Observable<T[]> { return this.http.get<T[]>(`${APP_CONFIG.apiUrl}/${resource}`); }
  protected item<T>(resource: string, slug: string): Observable<T> { return this.http.get<T>(`${APP_CONFIG.apiUrl}/${resource}/${encodeURIComponent(slug)}`); }
  protected create<TBody, TResult>(resource: string, body: TBody): Observable<TResult> { return this.http.post<TResult>(`${APP_CONFIG.apiUrl}/${resource}`, body); }
}

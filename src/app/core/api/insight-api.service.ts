import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentApiService } from './content-api.service';
import { Insight } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class InsightApiService extends ContentApiService {
  getInsights(): Observable<Insight[]> { return this.collection<Insight>('insights'); }
  getInsight(slug: string): Observable<Insight> { return this.item<Insight>('insights', slug); }
}

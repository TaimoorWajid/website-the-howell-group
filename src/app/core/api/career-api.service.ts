import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentApiService } from './content-api.service';
import { Career } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class CareerApiService extends ContentApiService {
  getCareers(): Observable<Career[]> { return this.collection<Career>('careers'); }
  getCareer(slug: string): Observable<Career> { return this.item<Career>('careers', slug); }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentApiService } from './content-api.service';
import { Service } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ServiceApiService extends ContentApiService {
  getServices(): Observable<Service[]> { return this.collection<Service>('services'); }
  getService(slug: string): Observable<Service> { return this.item<Service>('services', slug); }
}

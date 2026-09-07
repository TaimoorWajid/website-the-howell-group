import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactInquiry } from '../models/content.models';
import { ContentApiService } from './content-api.service';

@Injectable({ providedIn: 'root' })
export class ContactApiService extends ContentApiService { submitInquiry(inquiry: ContactInquiry): Observable<void> { return this.create<ContactInquiry, void>('contact', inquiry); } }

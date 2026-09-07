import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentApiService } from './content-api.service';
import { Testimonial } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class TestimonialApiService extends ContentApiService { getTestimonials(): Observable<Testimonial[]> { return this.collection<Testimonial>('testimonials'); } }

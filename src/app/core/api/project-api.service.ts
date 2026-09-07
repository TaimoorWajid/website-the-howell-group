import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentApiService } from './content-api.service';
import { Project } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ProjectApiService extends ContentApiService {
  getProjects(): Observable<Project[]> { return this.collection<Project>('projects'); }
  getProject(slug: string): Observable<Project> { return this.item<Project>('projects', slug); }
}

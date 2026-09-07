import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentApiService } from './content-api.service';
import { TeamMember } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class TeamApiService extends ContentApiService { getTeam(): Observable<TeamMember[]> { return this.collection<TeamMember>('team'); } }

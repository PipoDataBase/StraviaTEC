import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType } from '../models/activity-type.module';

@Injectable({
  providedIn: 'root'
})
export class ActivityTypesService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getActivityTypes(): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>(this.baseApiUrl + '/api/ActivityTypes');
  }
}

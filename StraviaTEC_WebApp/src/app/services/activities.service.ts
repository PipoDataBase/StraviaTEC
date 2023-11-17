import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.module';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.baseApiUrl + '/api/Comment');
  }

  getActivity(id: number): Observable<Activity> {
    return this.http.get<Activity>(this.baseApiUrl + '/api/Activities/' + id);
  }

  postActivity(activity: Activity): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Activities', activity);
  }

  putActivity(id: number, activity: Activity): Observable<boolean> {
    return this.http.put<boolean>(this.baseApiUrl + '/api/Activities/' + id, activity);
  }

  deleteActivity(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Activities/' + id);
  }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.module';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseApiUrl + '/api/Groups');
  }

  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(this.baseApiUrl + '/api/Groups/' + id);
  }

  getGroupsByManager(username: string): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseApiUrl + '/api/Groups/ByManager/' + username);
  }

  postGroup(groupName: string, username: string): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Groups/${groupName}/${username}`, null);
  }

  deleteGroup(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Challenges/' + id);
  }
}

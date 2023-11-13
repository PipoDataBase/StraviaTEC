import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Challenge } from '../models/challenge.module';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.baseApiUrl + '/api/Challenges');
  }

  getChallengesByManager(username: string): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.baseApiUrl + '/api/Challenges/mode/' + username);
  }

  getChallenge(id: string): Observable<Challenge> {
    return this.http.get<Challenge>(this.baseApiUrl + '/api/Challenges/' + id);
  }

  postChallenge(username: string, challenge: Challenge): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Challenges/' + username, challenge);
  }

  putChallenge(id: string, challenge: Challenge): Observable<boolean> {
    return this.http.put<boolean>(this.baseApiUrl + '/api/Challenges/' + id, challenge);
  }

  deleteChallenge(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Challenges/' + id);
  }
}

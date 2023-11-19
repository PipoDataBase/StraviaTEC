import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Challenge } from '../models/challenge.module';
import { AvailableChallenge } from '../models/views-models/vw-available-challenge.module';
import { Sponsor } from '../models/sponsor.module';
import { Group } from '../models/group.module';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.baseApiUrl + '/api/Challenges');
  }

  getChallenge(id: string): Observable<Challenge> {
    return this.http.get<Challenge>(this.baseApiUrl + '/api/Challenges/' + id);
  }

  getChallengesByManager(username: string): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.baseApiUrl + '/api/Challenges/ByManager/' + username);
  }

  getChallengeGroups(challengeName: string): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseApiUrl + '/api/Challenges/Groups/' + challengeName);
  }

  getChallengeSponsors(challengeName: string): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(this.baseApiUrl + '/api/Challenges/Sponsors/' + challengeName);
  }

  postChallenge(username: string, challenge: Challenge): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Challenges/' + username, challenge);
  }

  postChallengeSponsor(sponsorTradeName: string, challengeName: string): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Challenges/AddSponsor/${sponsorTradeName}/${challengeName}`, null);
  }

  putChallenge(id: string, challenge: Challenge): Observable<boolean> {
    return this.http.put<boolean>(this.baseApiUrl + '/api/Challenges/' + id, challenge);
  }

  deleteChallenge(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Challenges/' + id);
  }

  deleteChallengeGroups(challengeName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Challenges/DeleteGroups/' + challengeName);
  }

  deleteChallengeSponsors(challengeName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Challenges/DeleteSponsors/' + challengeName);
  }

  getAvailableChallengesVw(username: string): Observable<AvailableChallenge[]> {
    return this.http.get<AvailableChallenge[]>(this.baseApiUrl + '/api/Challenges/GetAvailableVwChallenges/' + username);
  }
}

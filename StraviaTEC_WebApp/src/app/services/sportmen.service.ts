import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Sportman } from '../models/sportman.module';
import { Challenge } from '../models/challenge.module';

@Injectable({
  providedIn: 'root'
})
export class SportmenService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getSportman(id: string): Observable<Sportman> {
    return this.http.get<Sportman>(this.baseApiUrl + '/api/Sportmen/' + id);
  }
  getSportmanParticipatingChallenges(username: string): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.baseApiUrl + '/api/Sportmen/participatingChallenges/' + username);
  }

  postSportman(sportman: Sportman): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Sportmen', sportman);
  }

  postSportmanChallengeInscription(challengeName: string, username: string): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Sportmen/AddToChallenge/${challengeName}/${username}`, null);
  }
}

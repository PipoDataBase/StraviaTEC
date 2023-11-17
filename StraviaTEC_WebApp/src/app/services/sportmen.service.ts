import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Sportman } from '../models/sportman.module';
import { SportmanNationality } from '../models/views-models/vw-sportman-nationality.module';
import { Challenge } from '../models/challenge.module';
import { Group } from '../models/group.module';
import { AvailableRace } from '../models/views-models/vw-available-race.module';

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

  getSportmanJoinedRaces(username: string): Observable<AvailableRace[]> {
    return this.http.get<AvailableRace[]>(this.baseApiUrl + '/api/Sportmen/GetJoinedRaces/' + username);
  }

  getSearchSportman(username: string): Observable<SportmanNationality[]> {
    return this.http.get<SportmanNationality[]>(this.baseApiUrl + '/api/Sportmen/Search/' + username)
  }

  getParticipatingGroups(username: string): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseApiUrl + '/api/Sportmen/GetParticipatingGroups/' + username)
  }

  getFriends(username: string): Observable<SportmanNationality[]> {
    return this.http.get<SportmanNationality[]>(this.baseApiUrl + '/api/Sportmen/GetFriends/' + username)
  }

  postSportman(sportman: Sportman): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Sportmen', sportman);
  }

  postSportmanChallengeInscription(challengeName: string, username: string): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Sportmen/AddToChallenge/${challengeName}/${username}`, null);
  }

  postAddFriend(username: string, friendUsername: string): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Sportmen/AddFriend/${username}/${friendUsername}`, null);
  }

  postJoinGroup(username: string, groupName: string): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Sportmen/JoinGroup/${username}/${groupName}`, null);
  }

  deleteLeaveGroup(username: string, groupName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + `/api/Sportmen/LeaveGroup/${username}/${groupName}`);
  }

  deleteUnfollowUser(username: string, friendName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + `/api/Sportmen/Unfollow/${username}/${friendName}`);
  }

  deleteLeaveChallenge(challengeName: string, username: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + `/api/Sportmen/LeaveChallenge/${challengeName}/${username}`);
  }

  deleteLeaveRace(raceName: string, username: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + `/api/Sportmen/LeaveRace/${raceName}/${username}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Race } from '../models/race.module';
import { Observable } from 'rxjs';
import { Sponsor } from '../models/sponsor.module';
import { Category } from '../models/category.module';
import { BankAccount } from '../models/bank-account.module';
import { AvailableRace } from '../models/views-models/vw-available-race.module';
import { RaceReportSportmanParticipant } from '../models/views-models/vw-sportman-race-report-participants.module';
import { RaceReportSportmanLeaderboard } from '../models/views-models/vw-sportman-race-report-leaderboard.module';
import { Group } from '../models/group.module';

@Injectable({
  providedIn: 'root'
})
export class RacesService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getRaces(): Observable<Race[]> {
    return this.http.get<Race[]>(this.baseApiUrl + '/api/Races');
  }

  getRace(id: string): Observable<Race> {
    return this.http.get<Race>(this.baseApiUrl + '/api/Races/' + id);
  }

  getRacesByManager(username: string): Observable<Race[]> {
    return this.http.get<Race[]>(this.baseApiUrl + '/api/Races/ByManager/' + username);
  }

  getRaceCategories(raceName: string): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseApiUrl + '/api/Races/Categories/' + raceName);
  }

  getRaceGroups(raceName: string): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseApiUrl + '/api/Races/Groups/' + raceName);
  }

  getRaceBankAccounts(raceName: string): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.baseApiUrl + '/api/Races/BankAccounts/' + raceName);
  }

  getRaceSponsors(raceName: string): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(this.baseApiUrl + '/api/Races/Sponsors/' + raceName);
  }

  postRace(username: string, race: Race): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Races/' + username, race);
  }

  postRaceCategory(raceName: string, categoryId: number): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Races/AddCategory/${raceName}/${categoryId}`, null);
  }

  postRaceSponsor(sponsorTradeName: string, raceName: string): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + `/api/Races/AddSponsor/${sponsorTradeName}/${raceName}`, null);
  }

  putRace(id: string, race: Race): Observable<boolean> {
    return this.http.put<boolean>(this.baseApiUrl + '/api/Races/' + id, race);
  }

  deleteRace(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Races/' + id);
  }

  deleteRaceCategories(raceName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Races/DeleteCategories/' + raceName);
  }

  deleteRaceGroups(raceName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Races/DeleteGroups/' + raceName);
  }

  deleteRaceSponsors(raceName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + '/api/Races/DeleteSponsors/' + raceName);
  }

  getAvailableRacesVw(username: string): Observable<AvailableRace[]> {
    return this.http.get<AvailableRace[]>(this.baseApiUrl + '/api/Races/GetAvailableVwRaces/' + username);
  }

  getAllRacesVw(username: string): Observable<AvailableRace[]> {
    return this.http.get<AvailableRace[]>(this.baseApiUrl + '/api/Races/GetAllRaces/' + username);
  }

  getRaceLeaderboardReport(raceName: string): Observable<RaceReportSportmanLeaderboard[]> {
    return this.http.get<RaceReportSportmanLeaderboard[]>(this.baseApiUrl + '/api/Races/GetLeaderboardReport/' + raceName);
  }

  getRaceParticipantsReport(raceName: string): Observable<RaceReportSportmanParticipant[]> {
    return this.http.get<RaceReportSportmanParticipant[]>(this.baseApiUrl + '/api/Races/GetParticipantReport/' + raceName);
  }
}

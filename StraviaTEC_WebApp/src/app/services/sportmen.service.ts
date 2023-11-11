import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Sportman } from '../models/sportman.module';

@Injectable({
  providedIn: 'root'
})
export class SportmenService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getSportman(id: string): Observable<Sportman> {
    return this.http.get<Sportman>(this.baseApiUrl + '/api/Sportmen/' + id);
  }

  postSportman(sportman: Sportman): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Sportmen', sportman);
  }
}

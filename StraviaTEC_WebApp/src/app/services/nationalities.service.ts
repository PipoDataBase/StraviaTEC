import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nationality } from '../models/nationality.module';

@Injectable({
  providedIn: 'root'
})
export class NationalitiesService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getNationalities(): Observable<Nationality[]> {
    return this.http.get<Nationality[]>(this.baseApiUrl + '/api/Nationalities');
  }

  getNationality(id: number): Observable<Nationality> {
    return this.http.get<Nationality>(this.baseApiUrl + '/api/Nationalities/' + id);
  }
}

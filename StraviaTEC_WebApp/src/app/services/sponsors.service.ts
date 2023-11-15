import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sponsor } from '../demo/components/inscriptions/inscriptions-races/inscriptions-races.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SponsorsService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getSponsors(): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(this.baseApiUrl + '/api/Sponsors');
  }
}

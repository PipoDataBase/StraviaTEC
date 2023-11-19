import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.module';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  postBill(bill: Bill): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/Bills', bill);
  }

  putAcceptBill(id: number): Observable<boolean> {
    return this.http.put<boolean>(this.baseApiUrl + '/api/Bills/AcceptBill/' + id, null);
  }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount } from '../models/bank-account.module';

@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  postBankAccount(bankAccount: BankAccount): Observable<boolean> {
    return this.http.post<boolean>(this.baseApiUrl + '/api/BankAccounts', bankAccount);
  }

  deleteBankAccount(bankAccount: string, raceName: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseApiUrl + `/api/BankAccounts/${bankAccount}/${raceName}`);
  }
}

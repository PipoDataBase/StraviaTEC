import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private datePipe: DatePipe) { }

  formatDate(date: string): string {
    const result = this.datePipe.transform(date, 'M/d/yyyy');
    if (result) {
      return result
    }
    return date;
  }
}
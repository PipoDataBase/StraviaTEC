import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivityType } from '../models/activity-type.module';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from '../models/category.module';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  constructor(private datePipe: DatePipe, private sanitizer: DomSanitizer) { }

  getUsername(): string {
    const data = localStorage.getItem('session');
    const session = JSON.parse(data);
    return session['username'];
  }

  formatDate(date: string): string {
    const result = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (result) {
      return result
    }
    return date;
  }

  formatDate2(date: string): string {
    const result = this.datePipe.transform(date, 'MM/dd/yyyy');
    if (result) {
      return result
    }
    return date;
  }

  formatDate3(date: string): string {
    const result = this.datePipe.transform(date, 'MM/dd/yyyy HH:mm');
    if (result) {
      return result
    }
    return date;
  }

  getActivityType(activityTypes: ActivityType[], id: number): string {
    const typeFound = activityTypes.find((type) => type.id == id);
    if (typeFound) {
      return typeFound.type;
    }
    return "";
  }

  getCategories(categories: Category[]): string {
    var result = "";
    categories.forEach(element => {
      result += element.category1 + ', '
    });

    if (result.length > 0) {
      result = result.slice(0, -2);
    }

    return result;
  }

  getSafeResourceUrl(route: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(route);
  }
}

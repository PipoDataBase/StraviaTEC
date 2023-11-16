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
    const typeFounded = activityTypes.find((type) => type.id == id);
    if (typeFounded) {
      return typeFounded.type;
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

  getCategoryDescription(categories: Category[], id: number): string {
    const categoryFounded = categories.find((category) => category.id == id);
    if (categoryFounded) {
      var result = categoryFounded.category1 + ' ('
      if (categoryFounded.category1 == 'Junior') {
        result += 'less than ' + categoryFounded.maximumAge + ' years)'
      }
      else if (categoryFounded.category1 == 'Sub-23') {
        result += 'from ' + categoryFounded.minimumAge + ' to ' + categoryFounded.maximumAge + ' years)';
      }
      else if (categoryFounded.category1 == 'Open') {
        result += 'from ' + categoryFounded.minimumAge + ' to ' + categoryFounded.maximumAge + ' years)';
      }
      else if (categoryFounded.category1 == 'Elite') {
        result += 'anyone who wants to sign up)';
      }
      else if (categoryFounded.category1 == 'Master A') {
        result += 'from ' + categoryFounded.minimumAge + ' to ' + categoryFounded.maximumAge + ' years)';
      }
      else if (categoryFounded.category1 == 'Master B') {
        result += 'from ' + categoryFounded.minimumAge + ' to ' + categoryFounded.maximumAge + ' years)';
      }
      else {
        result += 'more than ' + categoryFounded.minimumAge + ' years)';
      }
      return result;
    }
    return "";
  }

  getSafeResourceUrl(route: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(route);
  }
}

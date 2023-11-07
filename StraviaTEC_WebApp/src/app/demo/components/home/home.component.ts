import { Component } from '@angular/core';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { SharedService } from 'src/app/services/shared.service';

export interface Activity {
  id: number;
  kilometers: number;
  duration: number;
  date: string;
  routePath: string;
  description: string;
  username: string;
  raceName: string;
  challengeName: string;
  type: number;
}

export interface Sportman {
  username: string;
  name: string;
  lastName1: string;
  lastName2: string;
  birthDate: string;
  photoPath: string;
  password: string;
  nationality: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  //showContent = true;
  activities: Activity[] = [];
  activityTypes: ActivityType[] = [];

  sportman: Sportman = {
    username: 'MarinGE23',
    name: 'Emanuel',
    lastName1: 'Marín',
    lastName2: 'Gutiérrez',
    birthDate: '2000-01-21',
    photoPath: '../../../../assets/straviatec/default-avatar.png',
    password: 'abc123de',
    nationality: 18 // Costa Rican
  }

  constructor(public sharedService: SharedService, private activityTypesService: ActivityTypesService) { }

  ngOnInit() {
    //setTimeout(() => {
    //  this.hideContent();
    //}, 3000);

    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.activities = [
      {
        id: 1,
        kilometers: 85.39,
        duration: 300,
        date: '2023-11-07T06:30',
        routePath: 'https://www.google.com/maps/d/embed?mid=1cQv-iSgDnNCLG_jrQyX5emwZZDzLbixd&hl=es-419',
        description: 'Cycling tour in the morning',
        username: 'Emarin19',
        raceName: '',
        challengeName: '',
        type: 2
      },
      {
        id: 2,
        kilometers: 5.12,
        duration: 45,
        date: '2023-11-06T08:00',
        routePath: 'https://www.google.com/maps/d/embed?mid=18RcpszqRsKd-Gy4Q6N7PRl5eaPa1bzqL&hl=es-419',
        description: 'Running around the TEC',
        username: 'Emarin19',
        raceName: '',
        challengeName: '',
        type: 0
      },
      {
        id: 3,
        kilometers: 6.86,
        duration: 55,
        date: '2023-11-05T16:30',
        routePath: 'https://www.google.com/maps/d/embed?mid=18RcpszqRsKd-Gy4Q6N7PRl5eaPa1bzqL&hl=es-419',
        description: 'Afternoon warm-up',
        username: 'Emarin19',
        raceName: '',
        challengeName: '',
        type: 0
      }
    ];
  }

  //hideContent() {
  //  this.showContent = false;
  //}
}

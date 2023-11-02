import { Component } from '@angular/core';

export interface Sportman {
  username: string;
  name: string;
  lastName1: string;
  lastName2: string;
  birthDate: string;
  photoPath: string;
  password: string;
  nationality: string;
}

export interface MoreInfoTest {
  following: number;
  followers: number;
  activities: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  sportman: Sportman = {
    username: 'MarinGE23',
    name: 'Emanuel',
    lastName1: 'Marín',
    lastName2: 'Gutiérrez',
    birthDate: '2000-01-21',
    photoPath: '../../../../assets/straviatec/default-avatar.png',
    password: 'abc123de',
    nationality: 'Costa Rican'
  }

  sportmanMoreInfo: MoreInfoTest = {
    following: 2,
    followers: 0,
    activities: 3
  }

  updateSportmanInfo(password: string, name: string, lastName1: string, lastName2: string, nationality: string, birthDate: string, file: string): void {
    //validate data
    console.log(password, name, lastName1, lastName2, nationality, birthDate, file)
  }
}

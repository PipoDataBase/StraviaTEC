import { Component } from '@angular/core';
import { Nationality } from 'src/app/models/nationality.module';
import { NationalitiesService } from 'src/app/services/nationalities.service';

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
  private _sportman: Sportman = {
    username: 'MarinGE23',
    name: 'Emanuel',
    lastName1: 'Marín',
    lastName2: 'Gutiérrez',
    birthDate: '2000-01-21',
    photoPath: '../../../../assets/straviatec/default-avatar.png',
    password: 'abc123de',
    nationality: 18 // Costa Rican
  };
  public getSportman(): Sportman {
    return this._sportman;
  }
  public setSportman(value: Sportman) {
    this._sportman = value;
  }

  private _nationalities: Nationality[] = [];
  public getNationalities(): Nationality[] {
    return this._nationalities;
  }
  public setNationalities(value: Nationality[]) {
    this._nationalities = value;
  }

  private _sportmanMoreInfo: MoreInfoTest = {
    following: 2,
    followers: 0,
    activities: 3
  };
  public getSportmanMoreInfo(): MoreInfoTest {
    return this._sportmanMoreInfo;
  }
  public setSportmanMoreInfo(value: MoreInfoTest) {
    this._sportmanMoreInfo = value;
  }

  constructor(private nationalitiesService: NationalitiesService) { }

  ngOnInit(): void {
    this.nationalitiesService.getNationalities().subscribe({
      next: (nationalities) => {
        this.setNationalities(nationalities);
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  updateSportmanInfo(password: string, name: string, lastName1: string, lastName2, birthDate: string, file: string): void {
    //validate data
    console.log(password, name, lastName1, lastName2, birthDate, file)
  }
}

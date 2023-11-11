import { Component } from '@angular/core';
import { Nationality } from 'src/app/models/nationality.module';
import { Sportman } from 'src/app/models/sportman.module';
import { NationalitiesService } from 'src/app/services/nationalities.service';
import { SharedService } from 'src/app/services/shared.service';
import { SportmenService } from 'src/app/services/sportmen.service';

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
    username: '',
    name: '',
    lastName1: '',
    lastName2: '',
    birthDate: '',
    photoPath: '',
    password: '',
    nationality: -1
  };
  public getSportman(): Sportman {
    return this._sportman;
  }
  public setSportman(value: Sportman) {
    this._sportman = value;
  }

  private _nationality: Nationality = {
    id: -1,
    nationality1: ''
  };
  public getNationality(): Nationality {
    return this._nationality;
  }
  public setNationality(value: Nationality) {
    this._nationality = value;
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

  constructor(private sportmenService: SportmenService, private nationalitiesService: NationalitiesService, public sharedService: SharedService) { }

  ngOnInit(): void {
    // Get sportman
    this.sportmenService.getSportman(this.sharedService.getUsername()).subscribe({
      next: (sportman) => {
        sportman.birthDate = this.sharedService.formatDate(sportman.birthDate);
        if (sportman.photoPath == '') sportman.photoPath = '../../../../assets/straviatec/default-avatar.png';
        this.setSportman(sportman);

        // Get nationality
        this.nationalitiesService.getNationality(sportman.nationality).subscribe({
          next: (nationality) => {
            this.setNationality(nationality);
          },
          error: (response) => {
            console.log(response);
          }
        })
      },
      error: (response) => {
        console.log(response);
      }
    })

    // Get nationalities
    this.nationalitiesService.getNationalities().subscribe({
      next: (nationalities) => {
        this.setNationalities(nationalities);
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  updateSportmanInfo(name: string, lastName1: string, lastName2, birthDate: string, file: string): void {
    //validate data
    console.log(name, lastName1, lastName2, birthDate, file)
  }
}

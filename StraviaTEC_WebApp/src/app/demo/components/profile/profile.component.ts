import { Component } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Challenge } from 'src/app/models/challenge.module';
import { Nationality } from 'src/app/models/nationality.module';
import { Sportman } from 'src/app/models/sportman.module';
import { AvailableChallenge } from 'src/app/models/views-models/vw-available-challenge.module';
import { NationalitiesService } from 'src/app/services/nationalities.service';
import { SharedService } from 'src/app/services/shared.service';
import { SportmenService } from 'src/app/services/sportmen.service';
import { MessageService } from 'primeng/api';
import { ChallengesService } from 'src/app/services/challenges.service';
import { DataView } from 'primeng/dataview';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';

export interface MoreInfoTest {
  following: number;
  followers: number;
  activities: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService]
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

  activityTypes: ActivityType[] = [];

  myChallenges: Challenge[] = [];

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;
  sortField: string = '';

  constructor(private sportmenService: SportmenService, private messageService: MessageService, private nationalitiesService: NationalitiesService, public sharedService: SharedService, private sportmanService: SportmenService, private activityTypesService: ActivityTypesService) { }

  updateMyChallenges() {
    this.sportmanService.getSportmanParticipatingChallenges(this.sharedService.getUsername()).subscribe({
      next: (challenges) => {
        this.myChallenges = challenges;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
      }
    })
  }

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

    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })

    // Get all the challenges I've joined
    this.updateMyChallenges();

    this.sortOptions = [
      { label: 'Name descending', value: 'name' },
      { label: 'Name ascending', value: '!name' },
      { label: 'Goal', value: 'goal' },
      { label: 'Start date', value: 'startDate' },
      { label: 'End date', value: 'endDate' }
    ];
  }

  updateSportmanInfo(name: string, lastName1: string, lastName2, birthDate: string, file: string): void {
    //validate data
    console.log(name, lastName1, lastName2, birthDate, file)
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  getDateOnFormat(date: string): string {
    return this.sharedService.formatDate2(date);
  }

  leaveChallengeButtonOnClick(challengeName: string) {
    this.sportmanService.deleteLeaveChallenge(challengeName, this.sharedService.getUsername()).subscribe({
      next: (response) => {
        if (response) {
          this.updateMyChallenges();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenges loaded wrong.' });
        }
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Username or challenge name wrong.' });
      }
    })
  }

  isUserParticipatingOnChallenge(challengeName: string): boolean {
    return this.myChallenges.some(participatingChallenge => participatingChallenge.name === challengeName);
  }
}

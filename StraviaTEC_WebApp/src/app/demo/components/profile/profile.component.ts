import { Component, ElementRef, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Challenge } from 'src/app/models/challenge.module';
import { Nationality } from 'src/app/models/nationality.module';
import { Sportman } from 'src/app/models/sportman.module';
import { NationalitiesService } from 'src/app/services/nationalities.service';
import { SharedService } from 'src/app/services/shared.service';
import { SportmenService } from 'src/app/services/sportmen.service';
import { MessageService } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('avatarImage') avatarImage: ElementRef;

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

  currentImage: string = '';
  filePath: string = '';
  file: File = null;
  valid: boolean = true;

  activityTypes: ActivityType[] = [];

  myChallenges: Challenge[] = [];

  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  constructor(private sportmenService: SportmenService, private messageService: MessageService, private storage: AngularFireStorage, private nationalitiesService: NationalitiesService, public sharedService: SharedService, private sportmanService: SportmenService, private activityTypesService: ActivityTypesService) { }

  updateSportman() {
    this.currentImage = '';
    this.filePath = '';
    this.file = null;

    // Get sportman
    this.sportmenService.getSportman(this.sharedService.getUsername()).subscribe({
      next: (sportman) => {
        sportman.birthDate = this.sharedService.formatDate(sportman.birthDate);
        if (sportman.photoPath == '') sportman.photoPath = '../../../../assets/straviatec/default-avatar.png';
        this.currentImage = sportman.photoPath;
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
  }

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
    this.updateSportman();

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

  addShadow() {
    this.avatarImage.nativeElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  }

  removeShadow() {
    this.avatarImage.nativeElement.style.boxShadow = 'none';
  }

  openFileInput() {
    // Simular un clic en el elemento de entrada de archivos
    this.fileInput.nativeElement.click();
  }

  handleImageSelected(event: Event) {
    this.file = null;
    const inputElement = event.target as HTMLInputElement;
    this.file = inputElement.files?.[0];
    if (this.file) {
      this.filePath = `profile/${new Date().getTime()}_${this.file.name}`;
      const imageUrl = URL.createObjectURL(this.file);
      this.currentImage = imageUrl;
    }
  }

  updateSportmanInfo(name: string, lastName1: string, lastName2, birthDate: string): void {
    // Validate if there is empty data
    const message = this.verifyData(name, lastName1);
    if (!this.valid) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: message });
      this.valid = true;
      return;
    }

    // Validate valid birthdate
    const currentDate = new Date();
    const inputDate = new Date(birthDate);
    const minAge = 7;
    if (inputDate >= currentDate || (currentDate.getFullYear() - inputDate.getFullYear()) < minAge) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The birthdate is not valid. Must be at least 7 years old.' });
      return;
    }

    this.getSportman().name = name;
    this.getSportman().lastName1 = lastName1;
    this.getSportman().lastName2 = lastName2;
    this.getSportman().birthDate = birthDate;

    if (this.filePath != '') {
      const task = this.storage.upload(this.filePath, this.file);
      task.then(uploadTask => {
        uploadTask.ref.getDownloadURL().then(downloadURL => {
          console.log(downloadURL);
          this.getSportman().photoPath = downloadURL;
          this.sportmenService.putSportman(this.getSportman().username, this.getSportman()).subscribe({
            next: (response) => {
              if (response) {
                this.updateSportman();
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Your information has been updated!' });
              }
            },
            error: (response) => {
              console.log(response);
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'There was an error updating the information.' });
            }
          })
        });
      });
    }
    else {
      // Update sportman info
      this.sportmenService.putSportman(this.getSportman().username, this.getSportman()).subscribe({
        next: (response) => {
          if (response) {
            this.updateSportman();
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Your information has been updated!' });
          }
        },
        error: (response) => {
          console.log(response);
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'There was an error updating the information.' });
        }
      })
    }
  }

  verifyData(name, lastName1) {
    var errorMessage = "Please enter a valid value of: ";
    if (name == "") {
      errorMessage += "Name, ";
      this.valid = false;
    }

    if (lastName1 == "") {
      errorMessage += "Lastname, ";
      this.valid = false;
    }

    if (errorMessage.slice(-2, -1) == ",") {
      errorMessage = errorMessage.slice(0, -2);
      errorMessage += ".";
    }

    return errorMessage;
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

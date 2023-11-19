import { Component, ElementRef, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { AvailableChallenge } from 'src/app/models/views-models/vw-available-challenge.module';
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
import { AvailableRace } from 'src/app/models/views-models/vw-available-race.module';
import { Sponsor } from 'src/app/models/sponsor.module';
import { Category } from 'src/app/models/category.module';

import { RacesService } from 'src/app/services/races.service';
import { SponsorsService } from 'src/app/services/sponsors.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { BillService } from 'src/app/services/bill.service';

export interface MoreInfoTest {
  following: number;
  followers: number;
  activities: number;
}

export interface RaceCategory {
  raceName: string,
  category: string
}

export interface RaceBankAccount {
  raceName: string,
  bankAccount: string
}

export interface RaceSponsor {
  raceName: string,
  sponsorTradeName: string
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

  myChallenges: AvailableChallenge[] = [];
  myRaces: AvailableRace[] = [];

  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  // Races Starts
  isViewMoreInfo: boolean = false;
  raceMoreInfoDialog: boolean = false;
  raceRouteDialog: boolean = false;
  submitRaceDialog: boolean = false;

  raceReceiptUploaded: File | null = null;

  race: AvailableRace = {};

  sponsors: Sponsor[] = [];
  categories: Category[] = [];

  raceCategory: RaceCategory[] = []
  raceSponsor: RaceSponsor[] = []
  raceBankAccount: RaceBankAccount[] = [];

  selectedInscriptionCategory: string = '';

  // Races Ends

  constructor(private sportmenService: SportmenService, private messageService: MessageService, private storage: AngularFireStorage, private nationalitiesService: NationalitiesService, public sharedService: SharedService, private sportmanService: SportmenService, private activityTypesService: ActivityTypesService, private racesService: RacesService, private sponsorsService: SponsorsService, private categoriesService: CategoriesService, private billsService: BillService) { }

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

    // Races Starts

    // Requests database for all participating races
    this.sportmanService.getSportmanJoinedRaces(this.sharedService.getUsername()).subscribe({
      next: (joinedRaces) => {
        this.myRaces = joinedRaces;

        for (let i = 0; i < this.myRaces.length; i++) {
          // Requests all races categories to database
          this.racesService.getRaceCategories(this.myRaces[i].name).subscribe({
            next: (raceCategories) => {
              var raceCategoryToInsert: RaceCategory;
              for (let j = 0; j < raceCategories.length; j++) {
                raceCategoryToInsert = { raceName: this.myRaces[i].name, category: raceCategories[j].category1 }
                this.raceCategory.push(raceCategoryToInsert);
              }
            },
            error: (response) => {
              console.log(response);
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
            }
          })

          // Requests all race bank accounts to database
          this.racesService.getRaceBankAccounts(this.myRaces[i].name).subscribe({
            next: (bankAccounts) => {
              var raceBankAccountToInsert: RaceBankAccount;
              for (let j = 0; j < bankAccounts.length; j++) {
                raceBankAccountToInsert = { raceName: this.myRaces[i].name, bankAccount: bankAccounts[j].bankAccount1 }
                this.raceBankAccount.push(raceBankAccountToInsert);
              }
            },
            error: (response) => {
              console.log(response);
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
            }
          })

          // Requests all race sponsors to database
          this.racesService.getRaceSponsors(this.myRaces[i].name).subscribe({
            next: (sponsors) => {
              var raceSponsorToInsert: RaceSponsor;
              for (let j = 0; j < sponsors.length; j++) {
                raceSponsorToInsert = { raceName: this.myRaces[i].name, sponsorTradeName: sponsors[j].tradeName }
                this.raceSponsor.push(raceSponsorToInsert);
              }
            },
            error: (response) => {
              console.log(response);
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
            }
          })

        }


      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
      }
    })

    // Requests database for all sponsors
    this.sponsorsService.getSponsors().subscribe({
      next: (sponsors) => {
        this.sponsors = sponsors;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Sponosrs loaded wrong.' });
      }
    })

    // Requests database for all categories
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Categories loaded wrong.' });
      }
    })

    // Races Ends

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


  // Races Starts

  leaveRaceButtonOnClick(raceName: string) {
    this.sportmanService.deleteLeaveRace(raceName, this.sharedService.getUsername()).subscribe({
      next: (joinedRaces) => {
        // Requests database for all participating races
        this.sportmanService.getSportmanJoinedRaces(this.sharedService.getUsername()).subscribe({
          next: (joinedRaces) => {
            this.myRaces = joinedRaces;

            this.raceCategory = [];
            this.raceSponsor = [];
            this.raceBankAccount = [];

            for (let i = 0; i < this.myRaces.length; i++) {
              // Requests all races categories to database
              this.racesService.getRaceCategories(this.myRaces[i].name).subscribe({
                next: (raceCategories) => {
                  var raceCategoryToInsert: RaceCategory;
                  for (let j = 0; j < raceCategories.length; j++) {
                    raceCategoryToInsert = { raceName: this.myRaces[i].name, category: raceCategories[j].category1 }
                    this.raceCategory.push(raceCategoryToInsert);
                  }
                },
                error: (response) => {
                  console.log(response);
                  this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
                }
              })

              // Requests all race bank accounts to database
              this.racesService.getRaceBankAccounts(this.myRaces[i].name).subscribe({
                next: (bankAccounts) => {
                  var raceBankAccountToInsert: RaceBankAccount;
                  for (let j = 0; j < bankAccounts.length; j++) {
                    raceBankAccountToInsert = { raceName: this.myRaces[i].name, bankAccount: bankAccounts[j].bankAccount1 }
                    this.raceBankAccount.push(raceBankAccountToInsert);
                  }
                },
                error: (response) => {
                  console.log(response);
                  this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
                }
              })

              // Requests all race sponsors to database
              this.racesService.getRaceSponsors(this.myRaces[i].name).subscribe({
                next: (sponsors) => {
                  var raceSponsorToInsert: RaceSponsor;
                  for (let j = 0; j < sponsors.length; j++) {
                    raceSponsorToInsert = { raceName: this.myRaces[i].name, sponsorTradeName: sponsors[j].tradeName }
                    this.raceSponsor.push(raceSponsorToInsert);
                  }
                },
                error: (response) => {
                  console.log(response);
                  this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
                }
              })

            }


          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
          }
        })
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Race leaving wrong.' });
      }
    })
  }

  showRaceMoreInfoDialogButtonOnClick(race: AvailableRace) {
    this.race = { ...race };
    this.raceMoreInfoDialog = true;
    this.isViewMoreInfo = true;
  }

  hideRaceMoreInfoDialogButtonOnClick() {
    this.raceMoreInfoDialog = false;
    this.race = {};
  }

  showRaceRouteDialogButtonOnClick(race: AvailableRace) {
    this.race = { ...race };
    this.raceRouteDialog = true;
    setTimeout(() => {
      this.sharedService.parseGpxToJson(race.routePath);
    }, 500);
  }

  hideRaceRouteDialogButtonOnClick() {
    this.raceRouteDialog = false;
    this.race = {};
  }

  showSubmitRaceDailogButtonOnClick(race: AvailableRace) {
    this.raceReceiptUploaded = null;
    this.selectedInscriptionCategory = '';
    this.race = { ...race };
    this.submitRaceDialog = true;
  }

  hideSubmitRaceDailogButtonOnClick() {
    this.submitRaceDialog = false;
    this.race = {};
  }

  isSponsorOfRace(sponsorTradeName: string, raceName: string): boolean {
    for (let i = 0; i < this.raceSponsor.length; i++) {
      if (this.raceSponsor[i].raceName === raceName && this.raceSponsor[i].sponsorTradeName === sponsorTradeName) {
        return true;
      }
    }
    return false;
  }
}

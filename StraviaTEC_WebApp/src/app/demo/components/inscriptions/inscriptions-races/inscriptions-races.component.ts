import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { MessageService } from 'primeng/api';

import { SharedService } from 'src/app/services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';

// Models imports
import { AvailableRace } from 'src/app/models/views-models/vw-available-race.module';
import { Category } from 'src/app/models/category.module';
import { Sponsor } from 'src/app/models/sponsor.module';
import { Bill } from 'src/app/models/bill.module';


// Services imports
import { RacesService } from 'src/app/services/races.service';
import { SportmenService } from 'src/app/services/sportmen.service';
import { SponsorsService } from 'src/app/services/sponsors.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { BillService } from 'src/app/services/bill.service';

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

/*
export interface Race {
  name?: string,
  inscriptionPrice?: number,
  date?: string,
  private?: boolean,
  routePath?: string,
  typeId?: number
}

export interface ActivityType {
  id: number;
  type: string;
}



export interface Sponsor {
  tradeName: string,
  legalRepresentant: string,
  phone: number,
  logoPath: string
}

*/

@Component({
  selector: 'app-inscriptions-races',
  templateUrl: './inscriptions-races.component.html',
  styleUrls: ['./inscriptions-races.component.scss'],
  providers: [MessageService]
})
export class InscriptionsRacesComponent {

  isViewMoreInfo: boolean = false;
  raceMoreInfoDialog: boolean = false;
  raceRouteDialog: boolean = false;
  submitRaceDialog: boolean = false;

  raceReceiptUploaded: File | null = null;

  races: AvailableRace[] = [];

  race: AvailableRace = {};

  joinedRaces: AvailableRace[] = [];

  sponsors: Sponsor[] = [];
  categories: Category[] = [];

  raceCategory: RaceCategory[] = []
  raceSponsor: RaceSponsor[] = []
  raceBankAccount: RaceBankAccount[] = [];
  /*
    category: Category[] = []
  
    raceSponsor: RaceSponsor[] = []
  
    sponsors: Sponsor[] = []
  
    bankAccounts: RaceBankAccount[] = [];
    */

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  selectedInscriptionCategory: string = '';

  constructor(private racesService: RacesService, private sportmanService: SportmenService, private sponsorsService: SponsorsService, private categoriesService: CategoriesService, private billsService: BillService, public sharedService: SharedService, private sanitizer: DomSanitizer, private messageService: MessageService) { }

  ngOnInit() {
    // Requests database for all races
    this.racesService.getAvailableRacesVw(this.sharedService.getUsername()).subscribe({
      next: (availableRaces) => {
        this.races = availableRaces;

        for (let i = 0; i < this.races.length; i++) {
          // Requests all races categories to database
          this.racesService.getRaceCategories(this.races[i].name).subscribe({
            next: (raceCategories) => {
              var raceCategoryToInsert: RaceCategory;
              for (let j = 0; j < raceCategories.length; j++) {
                raceCategoryToInsert = { raceName: this.races[i].name, category: raceCategories[j].category1 }
                this.raceCategory.push(raceCategoryToInsert);
              }
            },
            error: (response) => {
              console.log(response);
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
            }
          })

          // Requests all race bank accounts to database
          this.racesService.getRaceBankAccounts(this.races[i].name).subscribe({
            next: (bankAccounts) => {
              var raceBankAccountToInsert: RaceBankAccount;
              for (let j = 0; j < bankAccounts.length; j++) {
                raceBankAccountToInsert = { raceName: this.races[i].name, bankAccount: bankAccounts[j].bankAccount1 }
                this.raceBankAccount.push(raceBankAccountToInsert);
              }
            },
            error: (response) => {
              console.log(response);
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
            }
          })

          // Requests all race sponsors to database
          this.racesService.getRaceSponsors(this.races[i].name).subscribe({
            next: (sponsors) => {
              var raceSponsorToInsert: RaceSponsor;
              for (let j = 0; j < sponsors.length; j++) {
                raceSponsorToInsert = { raceName: this.races[i].name, sponsorTradeName: sponsors[j].tradeName }
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

    // Requests database for all user participating races
    this.sportmanService.getSportmanJoinedRaces(this.sharedService.getUsername()).subscribe({
      next: (joinedRaces) => {
        this.joinedRaces = joinedRaces;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Joined races loaded wrong.' });
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

    /*
    this.races = [
      {
        name: 'Race1',
        inscriptionPrice: 20,
        date: '11/30/2023',
        private: false,
        routePath: 'https://www.google.com/maps/d/embed?mid=18RcpszqRsKd-Gy4Q6N7PRl5eaPa1bzqL&hl=es-419',
        typeId: 1
      },
      {
        name: 'Race2',
        inscriptionPrice: 25,
        date: '12/30/2023',
        private: false,
        routePath: 'https://www.google.com/maps/d/embed?mid=18RcpszqRsKd-Gy4Q6N7PRl5eaPa1bzqL&hl=es-419',
        typeId: 1
      },
      {
        name: 'Race3',
        inscriptionPrice: 35,
        date: '01/30/2024',
        private: false,
        routePath: 'https://www.google.com/maps/d/embed?mid=18RcpszqRsKd-Gy4Q6N7PRl5eaPa1bzqL&hl=es-419',
        typeId: 2
      }
    ];

    this.activities = [
      {
        id: 1,
        type: 'Runnig'
      },
      {
        id: 2,
        type: 'Cycling'
      }
    ];

    this.category = [
      {
        id: 1,
        minimunAge: 0,
        maximumAge: 15,
        category: "Junior"
      },
      {
        id: 2,
        minimunAge: 16,
        maximumAge: 23,
        category: "Sub-23"
      },
      {
        id: 3,
        minimunAge: 24,
        maximumAge: 30,
        category: "Open"
      },
      {
        id: 4,
        minimunAge: 0,
        maximumAge: 100,
        category: "Elite"
      },
      {
        id: 5,
        minimunAge: 31,
        maximumAge: 40,
        category: "Master A"
      },
      {
        id: 6,
        minimunAge: 41,
        maximumAge: 50,
        category: "Master B"
      },
      {
        id: 7,
        minimunAge: 51,
        maximumAge: 100,
        category: "Master C"
      }
    ]

    this.raceCategory = [
      {
        raceName: "Race1",
        categoryId: 1
      },
      {
        raceName: "Race1",
        categoryId: 2
      },
      {
        raceName: "Race1",
        categoryId: 3
      },
      {
        raceName: "Race1",
        categoryId: 4
      },
      {
        raceName: "Race2",
        categoryId: 4
      },
      {
        raceName: "Race2",
        categoryId: 5
      },
      {
        raceName: "Race2",
        categoryId: 6
      },
      {
        raceName: "Race2",
        categoryId: 7
      },
      {
        raceName: "Race3",
        categoryId: 4
      }
    ]

    this.sponsors = [
      {
        tradeName: 'Red Bull',
        legalRepresentant: 'Kimberly Brooks',
        phone: 22186442,
        logoPath: '../../../../../assets/straviatec/red-bull-logo.png'
      },
      {
        tradeName: 'The North Face',
        legalRepresentant: 'Bracken Darrell',
        phone: 22245312,
        logoPath: '../../../../../assets/straviatec/the-north-face-logo.png'
      }
    ]

    this.raceSponsor = [
      {
        sponsorTradeName: 'Red Bull',
        raceName: "Race1"
      },
      {
        sponsorTradeName: 'The North Face',
        raceName: "Race1"
      },
      {
        sponsorTradeName: 'Red Bull',
        raceName: "Race2"
      },
      {
        sponsorTradeName: 'The North Face',
        raceName: "Race3"
      }
    ]

    this.bankAccounts = [
      {
        raceName: 'Race1',
        bankAccount: 'CR05 0152 0200 1026 2840 66'
      },
      {
        raceName: 'Race1',
        bankAccount: 'CR05 0152 0200 1026 2840 88'
      },
      {
        raceName: 'Race2',
        bankAccount: 'CR05 0152 0200 1026 2840 88'
      },
      {
        raceName: 'Race3',
        bankAccount: 'CR05 0152 0200 1026 2840 88'
      }
    ]*/

    this.sortOptions = [
      { label: 'Name descending', value: 'name' },
      { label: 'Name ascending', value: '!name' },
      { label: 'Price', value: 'inscriptionPrice' },
      { label: 'Date', value: 'date' }
    ];
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

  onReceiptChanged(event: any) {
    const selectedFiles: FileList = event.target.files;
    if (selectedFiles.length > 0) {
      this.raceReceiptUploaded = selectedFiles[0];
    }
  }

  getDateOnFormat(date: string): string {
    return this.sharedService.formatDate2(date);
  }

  submitRaceButtonOnClick() {
    var selectedInscriptionCategoryId: number;

    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].category1 == this.selectedInscriptionCategory) {
        selectedInscriptionCategoryId = this.categories[i].id
      }
    }

    var billToPost: Bill = { photoPath: '', accepted: false, username: this.sharedService.getUsername(), raceName: this.race.name, categoryId: selectedInscriptionCategoryId }

    this.billsService.postBill(billToPost).subscribe({
      next: (categories) => {
        // Requests database for all user participating races
        this.sportmanService.getSportmanJoinedRaces(this.sharedService.getUsername()).subscribe({
          next: (joinedRaces) => {
            this.joinedRaces = joinedRaces;
          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Joined races loaded wrong.' });
          }
        })
        this.hideSubmitRaceDailogButtonOnClick()
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Race Submitted!', detail: 'Race and inscription receipt submitted succesfuly!' });

      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Categories loaded wrong.' });
      }
    })
  }

  leaveRaceButtonOnClick(raceName: string) {
    this.sportmanService.deleteLeaveRace(raceName, this.sharedService.getUsername()).subscribe({
      next: (joinedRaces) => {
        // Requests database for all user participating races
        this.sportmanService.getSportmanJoinedRaces(this.sharedService.getUsername()).subscribe({
          next: (joinedRaces) => {
            this.joinedRaces = joinedRaces;
          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Joined races loaded wrong.' });
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

  isUserJoinedOnRace(raceName: string): boolean {
    return this.joinedRaces.some(joinedRace => joinedRace.name === raceName);
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

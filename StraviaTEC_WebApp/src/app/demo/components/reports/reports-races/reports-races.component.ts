import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
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
import { RaceReportSportmanParticipant } from 'src/app/models/views-models/vw-sportman-race-report-participants.module';
import { RaceReportSportmanLeaderboard } from 'src/app/models/views-models/vw-sportman-race-report-leaderboard.module';

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
  selector: 'app-reports-races',
  templateUrl: './reports-races.component.html',
  styleUrls: ['./reports-races.component.scss'],
  providers: [MessageService]
})
export class ReportsRacesComponent {
  isViewMoreInfo: boolean = false;
  raceMoreInfoDialog: boolean = false;
  raceRouteDialog: boolean = false;
  submitRaceDialog: boolean = false;

  races: AvailableRace[] = [];

  race: AvailableRace = {};

  sponsors: Sponsor[] = [];
  categories: Category[] = [];

  raceCategory: RaceCategory[] = []
  raceSponsor: RaceSponsor[] = []
  raceBankAccount: RaceBankAccount[] = [];

  raceParticipants: RaceReportSportmanParticipant[] = [];
  raceLeaderboard: RaceReportSportmanLeaderboard[] = []

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  raceParticipantsLoading: boolean = true;
  raceLeaderboardLoading: boolean = true;

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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getDateOnFormat(date: string): string {
    return this.sharedService.formatDate2(date);
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

  showRaceReportDailogButtonOnClick(race: AvailableRace) {
    this.race = { ...race };

    // Request to database for participants
    this.raceParticipants =
      [
        {
          username: 'jose216',
          name: 'jose',
          lastName1: 'rodrig',
          lastName2: 'rojas',
          age: 23,
          photoPath: '',
          nationality: 'Costa Rican',
          category: 'Sub-23'
        },
        {
          username: 'jose216',
          name: 'jose',
          lastName1: 'rodrig',
          lastName2: 'rojas',
          age: 23,
          photoPath: '',
          nationality: 'Costa Rican',
          category: 'Sub-23'
        },
        {
          username: 'jose216',
          name: 'jose',
          lastName1: 'rodrig',
          lastName2: 'rojas',
          age: 23,
          photoPath: '',
          nationality: 'Costa Rican',
          category: 'Sub-23'
        }
      ]
    this.raceParticipantsLoading = false;

    // Request to database for leaderboard
    this.raceLeaderboard =
      [
        {
          username: 'jose216',
          name: 'jose',
          lastName1: 'rodrig',
          lastName2: 'rojas',
          age: 23,
          photoPath: '',
          nationality: 'Costa Rican',
          category: 'Sub-23',
          duration: '20'
        },
        {
          username: 'jose216',
          name: 'jose',
          lastName1: 'rodrig',
          lastName2: 'rojas',
          age: 23,
          photoPath: '',
          nationality: 'Costa Rican',
          category: 'Sub-23',
          duration: '21'
        },
        {
          username: 'jose216',
          name: 'jose',
          lastName1: 'rodrig',
          lastName2: 'rojas',
          age: 23,
          photoPath: '',
          nationality: 'Costa Rican',
          category: 'Sub-23',
          duration: '22'
        }
      ]
    this.raceLeaderboardLoading = false;

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

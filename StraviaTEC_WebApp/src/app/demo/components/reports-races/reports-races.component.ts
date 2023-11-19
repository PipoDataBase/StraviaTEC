import { Component } from '@angular/core';
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

// Services imports
import { RacesService } from 'src/app/services/races.service';
import { SportmenService } from 'src/app/services/sportmen.service';
import { SponsorsService } from 'src/app/services/sponsors.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { BillService } from 'src/app/services/bill.service';
import { RaceReportSportmanParticipant } from 'src/app/models/views-models/vw-sportman-race-report-participants.module';
import { RaceReportSportmanLeaderboard } from 'src/app/models/views-models/vw-sportman-race-report-leaderboard.module';

import jsPDF from 'jspdf';
import "jspdf-autotable";

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

  // For PDF generation
  cols1: any[];
  exportColumns1;

  cols2: any[];
  exportColumns2;

  constructor(private racesService: RacesService, private sportmanService: SportmenService, private sponsorsService: SponsorsService, private categoriesService: CategoriesService, private billsService: BillService, public sharedService: SharedService, private sanitizer: DomSanitizer, private messageService: MessageService) { }

  ngOnInit() {
    // Requests database for all races
    this.racesService.getAllRacesVw(this.sharedService.getUsername()).subscribe({
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

    this.cols1 = [
      { field: "username", header: "Username" },
      { field: "name", header: "Name" },
      { field: "lastName1", header: "First Last Name" },
      { field: "lastName2", header: "Second Last Name" },
      { field: "age", header: "Age" },
      { field: "category", header: "Category" }
    ];

    this.exportColumns1 = this.cols1.map(col => ({
      title: col.header,
      dataKey: col.field
    }));

    this.cols2 = [
      { field: "username", header: "Username" },
      { field: "name", header: "Name" },
      { field: "lastName1", header: "First Last Name" },
      { field: "lastName2", header: "Second Last Name" },
      { field: "age", header: "Age" },
      { field: "category", header: "Category" },
      { field: "duration", header: "Duration" }
    ];

    this.exportColumns2 = this.cols2.map(col => ({
      title: col.header,
      dataKey: col.field
    }));

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
    setTimeout(() => {
      this.sharedService.parseGpxToJson(race.routePath);
    }, 500);
  }

  hideRaceRouteDialogButtonOnClick() {
    this.raceRouteDialog = false;
    this.race = {};
  }

  showRaceReportDailogButtonOnClick(race: AvailableRace) {
    this.race = { ...race };

    this.raceParticipants = [];
    this.raceLeaderboard = [];

    // Request to database for participants
    this.racesService.getRaceParticipantsReport(this.race.name).subscribe({
      next: (raceParticipants) => {
        this.raceParticipants = raceParticipants;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Race participants loaded wrong.' });
      }
    })

    this.raceParticipantsLoading = false;

    // Request to database for leaderboard
    this.racesService.getRaceLeaderboardReport(this.race.name).subscribe({
      next: (raceLeaderboard) => {
        this.raceLeaderboard = raceLeaderboard;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Race leaderboard loaded wrong.' });
      }
    })

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

  exportParticipantsPdf() {
    const doc = new jsPDF('p');

    doc.setFontSize(20)

    doc.text('Report: ' + this.race.name, 14, 20)

    doc.setFontSize(14)

    doc.text('Race Participants', 14, 30)

    var body1: any[] = [];
    var forBody1: any[] = [];
    for (let i = 0; i < this.raceParticipants.length; i++) {
      forBody1 = [this.raceParticipants[i].username, this.raceParticipants[i].name, this.raceParticipants[i].lastName1, this.raceParticipants[i].lastName2, this.raceParticipants[i].age, this.raceParticipants[i].category]
      body1.push(forBody1);
    }

    doc['autoTable']({ head: [this.exportColumns1], body: body1, startY: 40 });

    doc.save(this.race.name.replace(' ', '') + "_ParticiantsReport.pdf");
  }

  exportLeaderboardPdf() {
    const doc = new jsPDF('p');

    doc.setFontSize(20)

    doc.text('Report: ' + this.race.name, 14, 20)

    doc.setFontSize(14)

    doc.text('Race Leaderboard', 14, 30)

    var body2: any[] = [];
    var forBody2: any[] = [];
    for (let i = 0; i < this.raceLeaderboard.length; i++) {
      forBody2 = [this.raceLeaderboard[i].username, this.raceLeaderboard[i].name, this.raceLeaderboard[i].lastName1, this.raceLeaderboard[i].lastName2, this.raceLeaderboard[i].age, this.raceLeaderboard[i].category, this.raceLeaderboard[i].duration]
      body2.push(forBody2);
    }

    doc['autoTable']({ head: [this.exportColumns2], body: body2, startY: 40 });

    doc.save(this.race.name.replace(' ', '') + "_LeaderboardReport.pdf");
  }

  exportCompletePdf() {
    const doc = new jsPDF('p');

    doc.setFontSize(20)

    doc.text('Report: ' + this.race.name, 14, 20)

    doc.setFontSize(14)

    doc.text('Race Participants', 14, 30)

    var body1: any[] = [];
    var forBody1: any[] = [];
    for (let i = 0; i < this.raceParticipants.length; i++) {
      forBody1 = [this.raceParticipants[i].username, this.raceParticipants[i].name, this.raceParticipants[i].lastName1, this.raceParticipants[i].lastName2, this.raceParticipants[i].age, this.raceParticipants[i].category]
      body1.push(forBody1);
    }

    doc['autoTable']({ head: [this.exportColumns1], body: body1, startY: 40 });

    doc.addPage();

    doc.text('Race Leaderboard', 14, 20)

    var body2: any[] = [];
    var forBody2: any[] = [];
    for (let i = 0; i < this.raceLeaderboard.length; i++) {
      forBody2 = [this.raceLeaderboard[i].username, this.raceLeaderboard[i].name, this.raceLeaderboard[i].lastName1, this.raceLeaderboard[i].lastName2, this.raceLeaderboard[i].age, this.raceLeaderboard[i].category, this.raceLeaderboard[i].duration]
      body2.push(forBody2);
    }

    doc['autoTable']({ head: [this.exportColumns2], body: body2, startY: 30 });

    doc.save(this.race.name.replace(' ', '') + "_CompleteReport.pdf");
  }
}

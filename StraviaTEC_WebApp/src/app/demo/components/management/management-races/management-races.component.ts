import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SharedService } from 'src/app/services/shared.service';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/category.module';
import { DomSanitizer } from '@angular/platform-browser';

export interface Race {
  name?: string;
  inscriptionPrice?: number;
  date?: string;
  private?: boolean;
  routePath?: string;
  type?: number;
  category?: number;
}

export interface BankAccount {
  raceName?: string;
  bankAccount1?: string;
}

export interface Sponsor {
  tradeName?: string;
  legalRepresentant?: string;
  phone?: number;
  logoPath?: string;
}

@Component({
  selector: 'app-management-races',
  templateUrl: './management-races.component.html',
  styleUrls: ['./management-races.component.scss'],
  providers: [MessageService]
})
export class ManagementRacesComponent {
  isNewRace: boolean = false;
  isViewMoreInfo: boolean = false;
  raceDialog: boolean = false;
  raceRouteDialog: boolean = false;
  raceMoreInfoDialog: boolean = false;
  deleteRaceDialog: boolean = false;
  deleteRacesDialog: boolean = false;

  selectedActivityType: number = -1;
  selectedPrivacy: boolean = false;
  selectedDeepHeight: boolean = false;

  races: Race[] = [];
  selectedRaces: Race[] = [];
  race: Race = {};
  activityTypes: ActivityType[] = [];
  categories: Category[] = [];

  bankAccounts: BankAccount[] = [];
  sponsors: Sponsor[] = [];

  submitted: boolean = false;

  constructor(private messageService: MessageService, private sharedService: SharedService, private activityTypesService: ActivityTypesService, private categoriesService: CategoriesService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.races = [
      {
        name: 'Race 1',
        inscriptionPrice: 20,
        date: '11/2/2023',
        private: false,
        routePath: 'https://www.google.com/maps/d/embed?mid=1cQv-iSgDnNCLG_jrQyX5emwZZDzLbixd&hl=es-419',
        type: 0, //running
        category: 1 //sub-23
      },
      {
        name: 'Race 2',
        inscriptionPrice: 25,
        date: '11/5/2023',
        private: true,
        routePath: 'https://www.google.com/maps/d/embed?mid=18RcpszqRsKd-Gy4Q6N7PRl5eaPa1bzqL&hl=es-419',
        type: 2, //cycling
        category: 3 //elite
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

    this.bankAccounts = [
      {
        raceName: 'Race',
        bankAccount1: 'CR05 0152 0200 1026 2840 66'
      },
      {
        raceName: 'Race',
        bankAccount1: 'CR05 0152 0200 1026 2840 88'
      }
    ]
  }

  openNew() {
    this.race = {};
    this.submitted = false;
    this.raceDialog = true;
    this.isNewRace = true;
  }

  seeRoute(race: Race) {
    this.race = { ...race };
    this.raceRouteDialog = true;
  }

  seeMoreInfo(race: Race) {
    this.race = { ...race };
    this.raceMoreInfoDialog = true;
    this.isViewMoreInfo = true;
  }

  deleteSelectedRaces() {
    this.deleteRacesDialog = true;
  }

  editRace(race: Race) {
    this.race = { ...race };
    this.raceDialog = true;
    this.isNewRace = false;
    this.selectedActivityType = race.type;
    this.selectedPrivacy = race.private;
  }

  deleteRace(race: Race) {
    this.deleteRaceDialog = true;
    this.race = { ...race };
  }

  confirmDeleteSelected() {
    this.deleteRacesDialog = false;
    this.races = this.races.filter(val => !this.selectedRaces.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Races Deleted', life: 3000 });
    this.selectedRaces = [];
  }

  confirmDelete() {
    this.deleteRaceDialog = false;
    this.races = this.races.filter(val => val.name !== this.race.name);
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Race Deleted', life: 3000 });
    this.race = {};
  }

  hideDialog() {
    this.raceDialog = false;
    this.submitted = false;
  }

  hideRaceRouteDialog() {
    this.raceRouteDialog = false;
  }

  hideRaceMoreInfoDialog() {
    this.raceMoreInfoDialog = false;
  }

  saveRace() {
    /*
    this.submitted = true;

    if (!this.isNewRace) {
      //validate data

      this.races = this.races.filter((race) => race.name !== this.race.name);
      const challengeUpdated: Race = {
        name: this.race.name,
        goal: this.race.goal,
        private: this.selectedPrivacy,
        startDate: this.sharedService.formatDate(this.race.startDate),
        endDate: this.sharedService.formatDate(this.race.endDate),
        deep: this.selectedDeepHeight,
        type: this.selectedActivityType
      }
      this.races.push(challengeUpdated);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Updated', life: 3000 });
    }
    else {
      const newrace: Race = {
        name: this.race.name,
        goal: this.race.goal,
        private: this.selectedPrivacy,
        startDate: this.sharedService.formatDate(this.race.startDate),
        endDate: this.sharedService.formatDate(this.race.endDate),
        deep: this.selectedDeepHeight,
        type: this.selectedActivityType
      }
      this.races.push(newChallenge);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Created', life: 3000 });
    }
    this.raceDialog = false;
    this.race = {}
    */
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getActivityType(id: number): string {
    const typeFounded = this.activityTypes.find((type) => type.id == id);
    if (typeFounded) {
      return typeFounded.type;
    }
    return "";
  }

  getCategory(id: number): string {
    const categoryFounded = this.categories.find((category) => category.id == id);
    if (categoryFounded) {
      return categoryFounded.category1;
    }
    return "";
  }

  getSafeResourceUrl(route: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(route);
  }
}

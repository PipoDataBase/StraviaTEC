import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { MessageService } from 'primeng/api';

import { SharedService } from 'src/app/services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';


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

export interface RaceCategory {
  raceName: string,
  categoryId: number
}

export interface Category {
  id: number,
  minimunAge: number,
  maximumAge: number,
  category: string
}

export interface BankAccount {
  raceName: string,
  bankAccount: string
}

export interface Sponsor {
  tradeName: string,
  legalRepresentant: string,
  phone: number,
  logoPath: string
}

export interface RaceSponsor {
  sponsorTradeName: string,
  raceName: string
}

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

  races: Race[] = [];

  race: Race = {};

  activities: ActivityType[] = []

  raceCategory: RaceCategory[] = []

  category: Category[] = []

  raceSponsor: RaceSponsor[] = []

  sponsors: Sponsor[] = []

  bankAccounts: BankAccount[] = [];

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  constructor(public sharedService: SharedService, private sanitizer: DomSanitizer, private messageService: MessageService) { }

  ngOnInit() {
    // Requests database for all races
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
    ]

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

  submitRaceButtonOnClick() {
    console.log("Submiting race " + this.race.name)
    this.hideSubmitRaceDailogButtonOnClick()
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'Race Submitted!', detail: 'Race and inscription receipt submitted succesfuly!' });
    
  }

  showRaceMoreInfoDialogButtonOnClick(race: Race) {
    this.race = { ...race };
    this.raceMoreInfoDialog = true;
    this.isViewMoreInfo = true;
  }

  hideRaceMoreInfoDialogButtonOnClick() {
    this.raceMoreInfoDialog = false;
    this.race = {};
  }

  showRaceRouteDialogButtonOnClick(race: Race) {
    this.race = { ...race };
    this.raceRouteDialog = true;
  }

  hideRaceRouteDialogButtonOnClick() {
    this.raceRouteDialog = false;
    this.race = {};
  }

  showSubmitRaceDailogButtonOnClick(race: Race) {
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

  getActivityType(id: number): string {
    const typeFounded = this.activities.find((type) => type.id == id);
    if (typeFounded) {
      return typeFounded.type;
    }
    return "";
  }
  getCategoryOfId(id: number): string {
    const categoryFounded = this.category.find((category) => category.id == id);
    if (categoryFounded) {
      return categoryFounded.category;
    }
    return "";
  }
}

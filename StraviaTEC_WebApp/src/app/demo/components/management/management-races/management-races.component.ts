import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SharedService } from 'src/app/services/shared.service';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/category.module';
import { Race } from 'src/app/models/race.module';
import { Sponsor } from 'src/app/models/sponsor.module';
import { BankAccount } from 'src/app/models/bank-account.module';
import { RacesService } from 'src/app/services/races.service';
import { SponsorsService } from 'src/app/services/sponsors.service';
import { forkJoin } from 'rxjs';
import { BankAccountsService } from 'src/app/services/bank-accounts.service';
import { Group } from 'src/app/models/group.module';
import { GroupsService } from 'src/app/services/groups.service';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-management-races',
  templateUrl: './management-races.component.html',
  styleUrls: ['./management-races.component.scss'],
  providers: [MessageService]
})
export class ManagementRacesComponent {
  numberRegExp: RegExp = /^[0-9]+$/;

  isNewRace: boolean = false;
  raceDialog: boolean = false;
  raceRouteDialog: boolean = false;
  raceMoreInfoDialog: boolean = false;
  raceBankAccountDialog: boolean = false;
  raceIBANAccountDialog: boolean = false;
  deleteRaceDialog: boolean = false;
  deleteRacesDialog: boolean = false;
  deleteBankAccountDialog: boolean = false;
  deleteBankAccountsDialog: boolean = false;

  selectedActivityType: number = -1;
  selectedPrivacy: boolean = false;
  routePath: any;

  races: Race[] = [];
  groups: Group[] = [];
  sponsors: Sponsor[] = [];
  categories: Category[] = [];
  bankAccounts: BankAccount[] = [];

  selectedRaces: Race[] = [];
  selectedGroups: Group[] = [];
  selectedSponsors: Sponsor[] = [];
  selectedCategories: Category[] = [];
  selectedBankAccounts: BankAccount[] = [];

  race: Race = {};
  group: Group = {};
  sponsor: Sponsor = {};
  category: Category = {};
  bankAccount: BankAccount = {};

  activityTypes: ActivityType[] = [];

  submitted: boolean = false;

  selectedRoute: string;

  constructor(private messageService: MessageService, public sharedService: SharedService, private activityTypesService: ActivityTypesService, private racesService: RacesService, private categoriesService: CategoriesService, private sponsorsService: SponsorsService, private bankAccountsService: BankAccountsService, private groupsService: GroupsService) { }

  updateRaces() {
    this.selectedRoute = '';
    this.racesService.getRacesByManager(this.sharedService.getUsername()).subscribe({
      next: (races) => {
        this.races = races;

        // We create an array of observables for the categories of each race
        const categoryObservables = this.races.map(race =>
          this.racesService.getRaceCategories(race.name)
        );

        // We use forkJoin to combine all observables into one
        forkJoin(categoryObservables).subscribe({
          next: (categoriesArray) => {
            // We assign the categories to each race in the same order as the races
            categoriesArray.forEach((categories, index) => {
              this.races[index].categories = categories;
            });
          },
          error: (response) => {
            console.log(response);
          }
        });
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  updateBankAccounts() {
    this.racesService.getRaceBankAccounts(this.race.name).subscribe({
      next: (bankAccounts) => {
        this.bankAccounts = bankAccounts;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  ngOnInit() {
    this.updateRaces();

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

    this.sponsorsService.getSponsors().subscribe({
      next: (sponsors) => {
        this.sponsors = sponsors;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.groupsService.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  openNew() {
    this.race = {};
    this.submitted = false;
    this.raceDialog = true;
    this.isNewRace = true;
    this.selectedActivityType = -1;
    this.selectedPrivacy = false;
    this.selectedCategories = [];
    this.selectedGroups = [];
  }

  openNewBankAccount() {
    this.bankAccount = {};
    this.raceIBANAccountDialog = true;
  }

  seeRoute(race: Race) {
    this.race = { ...race };
    this.raceRouteDialog = true;
    setTimeout(() => {
      this.parseGpxToJson(race.routePath);
    }, 500);
  }

  seeBankAccounts(race: Race) {
    this.race = { ...race };
    this.raceBankAccountDialog = true;
    this.updateBankAccounts();
  }

  seeMoreInfo(race: Race) {
    this.race = { ...race };
    this.raceMoreInfoDialog = true;

    this.racesService.getRaceSponsors(this.race.name).subscribe({
      next: (sponsors) => {
        this.selectedSponsors = sponsors;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  editRace(race: Race) {
    this.race = { ...race };
    this.raceDialog = true;
    this.isNewRace = false;
    this.selectedActivityType = race.type;
    this.selectedPrivacy = race.private;

    this.racesService.getRaceCategories(this.race.name).subscribe({
      next: (categories) => {
        this.selectedCategories = categories;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.racesService.getRaceGroups(this.race.name).subscribe({
      next: (groups) => {
        this.selectedGroups = groups;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  deleteRace(race: Race) {
    this.deleteRaceDialog = true;
    this.race = { ...race };
  }

  deleteBankAccount(bankAccount: BankAccount) {
    this.deleteBankAccountDialog = true;
    this.bankAccount = { ...bankAccount };
  }

  confirmDelete() {
    this.deleteRaceDialog = false;
    // Delete race
    this.racesService.deleteRace(this.race.name).subscribe({
      next: (response) => {
        if (response) {
          this.updateRaces();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Race Deleted.', life: 3000 });
        }
      },
      error: (response) => {
        console.log(response);
        return;
      }
    })

    this.race = {};
  }

  confirmDeleteBankAccount() {
    this.deleteBankAccountDialog = false;
    // Delete bank account
    this.bankAccountsService.deleteBankAccount(this.bankAccount.bankAccount1, this.bankAccount.raceName).subscribe({
      next: (response) => {
        if (response) {
          this.updateBankAccounts();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Bank Account Deleted.', life: 3000 });
        }
      },
      error: (response) => {
        console.log(response);
        return;
      }
    })

    this.bankAccount = {};
  }

  deleteSelectedRaces() {
    this.deleteRacesDialog = true;
  }

  deleteSelectedBankAccounts() {
    this.deleteBankAccountsDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteRacesDialog = false;
    for (var race of this.selectedRaces) {
      // Delete race
      this.racesService.deleteRace(race.name).subscribe({
        next: (response) => {
          if (response) {
            this.updateRaces();
          }
        },
        error: (response) => {
          console.log(response);
          return;
        }
      })
    }

    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Races Deleted.', life: 3000 });
    this.selectedRaces = [];
  }

  confirmDeleteSelectedBankAccounts() {
    this.deleteBankAccountsDialog = false;
    for (var bankAccount of this.selectedBankAccounts) {
      // Delete bank account
      this.bankAccountsService.deleteBankAccount(bankAccount.bankAccount1, bankAccount.raceName).subscribe({
        next: (response) => {
          if (response) {
            this.updateBankAccounts();
          }
        },
        error: (response) => {
          console.log(response);
          return;
        }
      })
    }

    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Bank Accounts Deleted.', life: 3000 });
    this.selectedBankAccounts = [];
  }

  hideDialog() {
    this.raceDialog = false;
    this.submitted = false;
    this.selectedCategories = [];
    this.selectedGroups = [];
  }

  hideRaceIBANAccountDialog() {
    this.raceIBANAccountDialog = false;
  }

  hideRaceBankAccountDialog() {
    this.raceBankAccountDialog = false;
    this.bankAccounts = [];
    this.selectedBankAccounts = [];
  }

  hideRaceRouteDialog() {
    this.raceRouteDialog = false;
  }

  hideRaceMoreInfoDialog() {
    this.raceMoreInfoDialog = false;
    this.selectedSponsors = [];
  }

  saveRace() {
    this.submitted = true;

    if (!this.isNewRace) {
      this.races = this.races.filter((race) => race.name !== this.race.name);
      const raceUpdated: Race = {
        name: this.race.name,
        inscriptionPrice: this.race.inscriptionPrice,
        date: this.race.date,
        private: Boolean(String(this.selectedPrivacy) == "true"),
        routePath: this.race.routePath,
        type: this.selectedActivityType
      }

      if (raceUpdated.private && this.selectedGroups.length == 0) {
        this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Warn', detail: 'If the race is private, it is suggested to add which groups can see it.' });
      }

      if (this.selectedRoute != '') {
        raceUpdated.routePath = this.selectedRoute;
      }

      if (this.validateRace(raceUpdated)) {
        // Put race
        this.racesService.putRace(raceUpdated.name, raceUpdated).subscribe({
          next: (response) => {
            if (response) {
              this.aboutCategories(raceUpdated.name);
              this.aboutGroups(raceUpdated.name, raceUpdated.private);
              this.updateRaces();
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Race Updated.', life: 3000 });
            }
          },
          error: (response) => {
            console.log(response);
            return;
          }
        })
      }
      else {
        this.updateRaces();
        return;
      }
    }
    else {
      const newRace: Race = {
        name: this.race.name,
        inscriptionPrice: this.race.inscriptionPrice,
        date: this.race.date,
        private: Boolean(String(this.selectedPrivacy) == "true"),
        routePath: '',
        type: this.selectedActivityType
      }

      if (newRace.private && this.selectedGroups.length == 0) {
        this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Warn', detail: 'If the race is private, it is suggested to add which groups can see it.' });
      }

      if (this.selectedRoute == '') {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not added the .gpx file.' });
        return;
      }
      newRace.routePath = this.selectedRoute;

      if (this.validateRace(newRace)) {
        // Post race
        this.racesService.postRace(this.sharedService.getUsername(), newRace).subscribe({
          next: (response) => {
            if (response) {
              this.aboutCategories(newRace.name);
              this.aboutGroups(newRace.name, newRace.private);
              this.updateRaces();
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Race Created.', life: 3000 });
            }
          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The race may have already been created by another organizer.' });
            return;
          }
        })
      }
      else {
        return;
      }
    }

    this.raceDialog = false;
  }

  saveRaceIBANAccount() {
    if (!this.bankAccount.bankAccount1) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The bank account must not be empty.' });
      return;
    }

    const length = String(this.bankAccount.bankAccount1).length;
    if (length < 20 || length > 20) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The bank account is incorrect.' });
      return;
    }

    if (!this.validateBankAccount(this.bankAccount.bankAccount1)) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The bank account should only have numbers.' });
      return;
    }

    const bankAccountFound = this.bankAccounts.find((ba) => ba.bankAccount1 == "CR" + this.bankAccount.bankAccount1);
    if (bankAccountFound) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Bank account: CR' + this.bankAccount.bankAccount1 + ' already exists.' });
      return;
    }

    const newBankAccount: BankAccount = {
      bankAccount1: "CR" + this.bankAccount.bankAccount1,
      raceName: this.race.name
    }

    this.bankAccountsService.postBankAccount(newBankAccount).subscribe({
      next: (response) => {
        if (response) {
          this.bankAccount = {};
          this.updateBankAccounts();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'BankAccount Created.', life: 3000 });
        }
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.raceIBANAccountDialog = false;
  }

  saveMoreInfo() {
    this.racesService.deleteRaceSponsors(this.race.name).subscribe({
      next: (response) => {
        if (response) {
          for (var sponsor of this.selectedSponsors) {
            this.racesService.postRaceSponsor(sponsor.tradeName, this.race.name).subscribe({
              next: (response) => {
              },
              error: (response) => {
                console.log(response);
              }
            })
          }
        }

        this.selectedSponsors = [];
        this.race = {}
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Race sponsors updated.', life: 3000 });
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.raceMoreInfoDialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'gpx') {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You must select a file with a .gpx extension.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (eventReader) => {
        const gpxString = eventReader.target?.result as string;
        this.selectedRoute = gpxString;
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsText(file);
    }
  }

  validateRace(race: Race): boolean {
    if (!race.name) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The race name must not be empty.' });
      return false;
    }

    const raceFound = this.races.find((r) => r.name == race.name);
    if (raceFound) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Race name: ' + race.name + ' already exists.' });
      return false;
    }

    if (!race.inscriptionPrice || race.inscriptionPrice <= 0) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The inscription price must be greater than zero.' });
      return false;
    }

    if (!race.date) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Date not selected.' });
      return false;
    }

    const raceDate = new Date(race.date);
    const currentDate = new Date();
    if (raceDate <= currentDate) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Incorrect date.' });
      return false;
    }

    if (race.type == -1) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not selected an activity type.' });
      return false;
    }

    if (this.selectedCategories.length == 0) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You must select at least one category for the race.' });
      return false;
    }

    return true;
  }

  validateBankAccount(value: string): boolean {
    if (this.numberRegExp.test(value)) {
      return true;
    }
    return false;
  }

  aboutCategories(name: string) {
    this.racesService.deleteRaceCategories(name).subscribe({
      next: (response) => {
        if (response) {
          const postCategoryObservables = this.selectedCategories.map(category =>
            this.racesService.postRaceCategory(name, category.id)
          );

          forkJoin(postCategoryObservables).subscribe({
            next: (response) => {
            },
            error: (response) => {
              console.log(response);
            }
          });
        }

        this.selectedCategories = [];
        this.race = {};
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  aboutGroups(name: string, isPrivate: boolean) {
    this.racesService.deleteRaceGroups(name).subscribe({
      next: (response) => {
        if (response && isPrivate) {
          const postGroupObservables = this.selectedGroups.map(group =>
            this.groupsService.postRaceGroup(name, group.name)
          );

          forkJoin(postGroupObservables).subscribe({
            next: (response) => {
            },
            error: (response) => {
              console.log(response);
            }
          });
        }

        this.selectedGroups = [];
        this.race = {};
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  setCategories(name: string): string {
    const raceFound = this.races.find((race) => race.name == name);
    if (raceFound) {
      return this.sharedService.getCategories(raceFound.categories)
    }
    return "";
  }

  parseGpxToJson(gpxString: string): void {
    const parser = new xml2js.Parser({ explicitArray: false });
    var cleanedString = gpxString.replace("\ufeff", "");

    parser.parseString(cleanedString, (error, result) => {
      if (error) {
        console.error('Error parsing GPX:', error);
      } else {
        // Your GPX data in JSON format
        const jsonData = result;

        this.createMap(jsonData);
      }
    })
  }

  createMap(jsonData: any) {
    const centerValue = jsonData.gpx.trk.trkseg.trkpt.length / 2

    const latCenter = jsonData.gpx.trk.trkseg.trkpt[centerValue.toFixed()].$.lat;
    const lonCenter = jsonData.gpx.trk.trkseg.trkpt[centerValue.toFixed()].$.lon;

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: Number(latCenter), lng: Number(lonCenter) }, // Set the initial center of the map
      zoom: 18 // Set the initial zoom level
    });

    var pathCoordinates = [];

    if (jsonData && jsonData.gpx.trk && jsonData.gpx.trk.trkseg && jsonData.gpx.trk.trkseg.trkpt) {
      const trkptArray = jsonData.gpx.trk.trkseg.trkpt;

      for (let index = 0; index < trkptArray.length; index++) {
        const element = trkptArray[index];
        const lat = element.$.lat;
        const lon = element.$.lon;
        const Latlng = new google.maps.LatLng(Number(lat), Number(lon));
        pathCoordinates[index] = Latlng
      }
    }

    const polyline = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    // Set the polyline on the map
    polyline.setMap(map);
  }
}

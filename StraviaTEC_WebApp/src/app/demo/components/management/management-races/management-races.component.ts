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

@Component({
  selector: 'app-management-races',
  templateUrl: './management-races.component.html',
  styleUrls: ['./management-races.component.scss'],
  providers: [MessageService]
})
export class ManagementRacesComponent {
  isNewRace: boolean = false;
  raceDialog: boolean = false;
  raceRouteDialog: boolean = false;
  raceMoreInfoDialog: boolean = false;
  deleteRaceDialog: boolean = false;
  deleteRacesDialog: boolean = false;

  selectedActivityType: number = -1;
  selectedPrivacy: boolean = false;
  routePath: any;

  races: Race[] = [];
  sponsors: Sponsor[] = [];
  categories: Category[] = [];

  selectedRaces: Race[] = [];
  selectedSponsors: Sponsor[] = [];
  selectedCategories: Category[] = [];

  race: Race = {};
  sponsor: Sponsor = {};
  category: Category = {};

  activityTypes: ActivityType[] = [];
  bankAccounts: BankAccount[] = [];

  submitted: boolean = false;

  constructor(private messageService: MessageService, public sharedService: SharedService, private activityTypesService: ActivityTypesService, private racesService: RacesService, private categoriesService: CategoriesService, private sponsorsService: SponsorsService) { }

  updateRaces() {
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
    this.selectedActivityType = -1;
    this.selectedCategories = [];
    this.selectedPrivacy = false;
  }

  seeRoute(race: Race) {
    this.race = { ...race };
    this.raceRouteDialog = true;
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
  }

  deleteRace(race: Race) {
    this.deleteRaceDialog = true;
    this.race = { ...race };
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

  deleteSelectedRaces() {
    this.deleteRacesDialog = true;
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

  hideDialog() {
    this.raceDialog = false;
    this.submitted = false;
    this.selectedCategories = [];
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
        routePath: '',
        type: this.selectedActivityType
      }

      if (this.validateRace(raceUpdated)) {
        // Put race
        this.racesService.putRace(raceUpdated.name, raceUpdated).subscribe({
          next: (response) => {
            if (response) {
              this.aboutCategories(raceUpdated.name);
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

      if (this.validateRace(newRace)) {
        // Post race
        this.racesService.postRace(this.sharedService.getUsername(), newRace).subscribe({
          next: (response) => {
            if (response) {
              this.aboutCategories(newRace.name);
              this.updateRaces();
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Race Created.', life: 3000 });
            }
          },
          error: (response) => {
            console.log(response);
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

  validateRace(race: Race): boolean {
    if (!race.name) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The race name must not be empty.' });
      return false;
    }

    const raceFound = this.races.find((r) => r.name == race.name);
    if (raceFound) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Race name: ' + race.name + ' already exists or it was created by another organizer.' });
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

  setCategories(name: string): string {
    const raceFounded = this.races.find((race) => race.name == name);
    if (raceFounded) {
      return this.sharedService.getCategories(raceFounded.categories)
    }
    return "";
  }
}

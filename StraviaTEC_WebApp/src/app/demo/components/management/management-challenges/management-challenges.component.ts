import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SharedService } from 'src/app/services/shared.service';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { Challenge } from 'src/app/models/challenge.module';
import { ChallengesService } from 'src/app/services/challenges.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Sponsor } from 'src/app/models/sponsor.module';
import { SponsorsService } from 'src/app/services/sponsors.service';

@Component({
  selector: 'app-management-challenges',
  templateUrl: './management-challenges.component.html',
  styleUrls: ['./management-challenges.component.scss'],
  providers: [MessageService]
})
export class ManagementChallengesComponent {
  isNewChallenge: boolean = false;
  challengeDialog: boolean = false;
  challengeSponsorDialog: boolean = false;
  deleteChallengeDialog: boolean = false;
  deleteChallengesDialog: boolean = false;

  selectedActivityType: number = -1;
  selectedPrivacy: boolean = false;
  selectedDeepHeight: boolean = false;

  challenges: Challenge[] = [];
  sponsors: Sponsor[] = [];

  selectedChallenges: Challenge[] = [];
  selectedSponsors: Sponsor[] = [];

  challenge: Challenge = {};
  sponsor: Sponsor = {};

  activityTypes: ActivityType[] = [];

  submitted: boolean = false;

  constructor(private messageService: MessageService, public sharedService: SharedService, private activityTypesService: ActivityTypesService, private challengesService: ChallengesService, private sponsorsService: SponsorsService, private storage: AngularFireStorage) { }

  updateChallenges() {
    this.challengesService.getChallengesByManager(this.sharedService.getUsername()).subscribe({
      next: (challenges) => {
        this.challenges = challenges;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  ngOnInit() {
    this.updateChallenges();

    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
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
  }

  openNew() {
    this.challenge = {};
    this.submitted = false;
    this.challengeDialog = true;
    this.isNewChallenge = true;
    this.selectedActivityType = -1;
    this.selectedPrivacy = false;
    this.selectedDeepHeight = false;
  }

  challengeSponsor(challenge: Challenge) {
    this.challenge = { ...challenge };
    this.challengeSponsorDialog = true;

    this.challengesService.getChallengeSponsors(this.challenge.name).subscribe({
      next: (sponsors) => {
        this.selectedSponsors = sponsors;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  editChallenge(challenge: Challenge) {
    this.challenge = { ...challenge };
    this.challengeDialog = true;
    this.isNewChallenge = false;
    this.selectedActivityType = challenge.type;
    this.selectedPrivacy = challenge.private;
    this.selectedDeepHeight = challenge.deep;
    this.challenge.startDate = this.sharedService.formatDate(this.challenge.startDate);
    this.challenge.endDate = this.sharedService.formatDate(this.challenge.endDate);
  }

  deleteChallenge(challenge: Challenge) {
    this.deleteChallengeDialog = true;
    this.challenge = { ...challenge };
  }

  confirmDelete() {
    this.deleteChallengeDialog = false;
    // Delete challenge
    this.challengesService.deleteChallenge(this.challenge.name).subscribe({
      next: (response) => {
        if (response) {
          this.updateChallenges();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenge Deleted.', life: 3000 });
        }
      },
      error: (response) => {
        console.log(response);
        return;
      }
    })

    this.challenge = {};
  }

  deleteSelectedChallenges() {
    this.deleteChallengesDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteChallengesDialog = false;
    for (var challenge of this.selectedChallenges) {
      // Delete challenge
      this.challengesService.deleteChallenge(challenge.name).subscribe({
        next: (response) => {
          if (response) {
            this.updateChallenges();
          }
        },
        error: (response) => {
          console.log(response);
          return;
        }
      })
    }

    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenges Deleted.', life: 3000 });
    this.selectedChallenges = [];
  }

  hideDialog() {
    this.challengeDialog = false;
    this.submitted = false;
  }

  hideChallengeSponsorDialog() {
    this.challengeSponsorDialog = false;
    this.selectedSponsors = [];
  }

  saveChallenge() {
    this.submitted = true;

    if (!this.isNewChallenge) {
      this.challenges = this.challenges.filter((challenge) => challenge.name !== this.challenge.name);
      const challengeUpdated: Challenge = {
        name: this.challenge.name,
        goal: this.challenge.goal,
        private: Boolean(String(this.selectedPrivacy) == "true"),
        startDate: this.challenge.startDate,
        endDate: this.challenge.endDate,
        deep: Boolean(String(this.selectedDeepHeight) == "true"),
        type: this.selectedActivityType
      }

      if (this.validateChallenge(challengeUpdated)) {
        // Put challenge
        this.challengesService.putChallenge(challengeUpdated.name, challengeUpdated).subscribe({
          next: (response) => {
            if (response) {
              this.updateChallenges();
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenge Updated.', life: 3000 });
            }
          },
          error: (response) => {
            console.log(response);
            return;
          }
        })
      }
      else {
        this.updateChallenges();
        return;
      }
    }
    else {
      const newChallenge: Challenge = {
        name: this.challenge.name,
        goal: this.challenge.goal,
        private: Boolean(String(this.selectedPrivacy) == "true"),
        startDate: this.challenge.startDate,
        endDate: this.challenge.endDate,
        deep: Boolean(String(this.selectedDeepHeight) == "true"),
        type: this.selectedActivityType
      }

      if (this.validateChallenge(newChallenge)) {
        // Post challenge
        this.challengesService.postChallenge(this.sharedService.getUsername(), newChallenge).subscribe({
          next: (response) => {
            if (response) {
              this.updateChallenges();
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenge Created.', life: 3000 });
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

    this.challengeDialog = false;
    this.challenge = {}
  }

  saveChallengeSponsor() {
    this.challengesService.deleteChallengeSponsors(this.challenge.name).subscribe({
      next: (response) => {
        if (response) {
          for (var sponsor of this.selectedSponsors) {
            this.challengesService.postChallengeSponsor(sponsor.tradeName, this.challenge.name).subscribe({
              next: (response) => {
              },
              error: (response) => {
                console.log(response);
              }
            })
          }
        }

        this.selectedSponsors = [];
        this.challenge = {}
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenge sponsors updated.', life: 3000 });
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.challengeSponsorDialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // save image in firebase and get his name
  onImageSelected(event: Event, sponsor: Sponsor) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      const filePath = `sponsors/${new Date().getTime()}_${file.name}`;
      const task = this.storage.upload(filePath, file);
      task.then(uploadTask => {
        uploadTask.ref.getDownloadURL().then(downloadURL => {
          sponsor.logoPath = downloadURL;
        });
      });
    }
  }

  validateChallenge(challenge: Challenge): boolean {
    if (!challenge.name) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The challenge name must not be empty.' });
      return false;
    }

    const challengeFound = this.challenges.find((c) => c.name == challenge.name);
    if (challengeFound) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenge name: ' + challenge.name + ' already exists.' });
      return false;
    }

    if (!challenge.goal || challenge.goal <= 0) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The goal must be greater than zero.' });
      return false;
    }

    if (!challenge.startDate) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Start date not selected.' });
      return false;
    }

    if (!challenge.endDate) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'End date not selected.' });
      return false;
    }

    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    if (startDate >= endDate) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Incorrect dates.' });
      return false;
    }

    if (challenge.type == -1) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not selected an activity type.' });
      return false;
    }

    return true;
  }
}

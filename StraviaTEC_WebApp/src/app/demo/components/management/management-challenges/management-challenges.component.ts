import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SharedService } from 'src/app/services/shared.service';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { Challenge } from 'src/app/models/challenge.module';
import { ChallengesService } from 'src/app/services/challenges.service';

@Component({
  selector: 'app-management-challenges',
  templateUrl: './management-challenges.component.html',
  styleUrls: ['./management-challenges.component.scss'],
  providers: [MessageService]
})
export class ManagementChallengesComponent {
  isNewChallenge: boolean = false;
  challengeDialog: boolean = false;
  deleteChallengeDialog: boolean = false;
  deleteChallengesDialog: boolean = false;

  selectedActivityType: number = -1;
  selectedPrivacy: boolean = false;
  selectedDeepHeight: boolean = false;

  challenges: Challenge[] = [];
  selectedChallenges: Challenge[] = [];
  challenge: Challenge = {};
  activityTypes: ActivityType[] = [];

  submitted: boolean = false;

  constructor(private messageService: MessageService, public sharedService: SharedService, private activityTypesService: ActivityTypesService, private challengesService: ChallengesService) { }

  ngOnInit() {
    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.challengesService.getChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
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

  deleteSelectedChallenges() {
    this.deleteChallengesDialog = true;
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

  confirmDeleteSelected() {
    this.deleteChallengesDialog = false;
    this.challenges = this.challenges.filter(val => !this.selectedChallenges.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenges Deleted', life: 3000 });
    this.selectedChallenges = [];
  }

  confirmDelete() {
    this.deleteChallengeDialog = false;
    this.challenges = this.challenges.filter(val => val.name !== this.challenge.name);
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Deleted', life: 3000 });
    this.challenge = {};
  }

  hideDialog() {
    this.challengeDialog = false;
    this.submitted = false;
  }

  saveChallenge() {
    this.submitted = true;

    if (!this.isNewChallenge) {
      this.challenges = this.challenges.filter((challenge) => challenge.name !== this.challenge.name);
      const challengeUpdated: Challenge = {
        name: this.challenge.name,
        goal: this.challenge.goal,
        private: this.selectedPrivacy,
        startDate: this.sharedService.formatDate(this.challenge.startDate),
        endDate: this.sharedService.formatDate(this.challenge.endDate),
        deep: this.selectedDeepHeight,
        type: this.selectedActivityType
      }
      this.challenges.push(challengeUpdated);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Updated', life: 3000 });
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
        this.challengesService.postChallenge(newChallenge).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (response) => {
            console.log(response);
            return;
          }
        })
        
        this.challenges.push(newChallenge);
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenge Created', life: 3000 });
      }
      else {
        return;
      }

    }
    this.challengeDialog = false;
    this.challenge = {}
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

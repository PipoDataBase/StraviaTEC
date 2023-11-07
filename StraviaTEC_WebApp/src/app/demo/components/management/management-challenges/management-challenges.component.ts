import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SharedService } from 'src/app/services/shared.service';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';

export interface Challenge {
  name?: string;
  goal?: number;
  private?: boolean;
  startDate?: string;
  endDate?: string;
  deep?: boolean;
  type?: number;
}

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

  constructor(private messageService: MessageService, public sharedService: SharedService, private activityTypesService: ActivityTypesService) { }

  ngOnInit() {
    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.challenges = [
      {
        name: 'Challenge 1',
        goal: 5,
        private: false,
        startDate: '2023-11-02',
        endDate: '2023-11-03',
        deep: true,
        type: 0 //runnig
      },
      {
        name: 'Challenge 2',
        goal: 10,
        private: true,
        startDate: '2023-11-02',
        endDate: '2023-11-03',
        deep: false,
        type: 2 //cycling
      }
    ]
  }

  openNew() {
    this.challenge = {};
    this.submitted = false;
    this.challengeDialog = true;
    this.isNewChallenge = true;
    this.selectedActivityType = -1;
    this.selectedPrivacy = false;
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
      //validate data

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
        private: this.selectedPrivacy,
        startDate: this.sharedService.formatDate(this.challenge.startDate),
        endDate: this.sharedService.formatDate(this.challenge.endDate),
        deep: this.selectedDeepHeight,
        type: this.selectedActivityType
      }
      this.challenges.push(newChallenge);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Created', life: 3000 });
    }
    this.challengeDialog = false;
    this.challenge = {}
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

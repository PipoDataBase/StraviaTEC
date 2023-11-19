import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';

// Models imports
import { AvailableChallenge } from 'src/app/models/views-models/vw-available-challenge.module';

// Services imports
import { ChallengesService } from 'src/app/services/challenges.service';
import { SportmenService } from 'src/app/services/sportmen.service';
import { SharedService } from 'src/app/services/shared.service';
import { MessageService } from 'primeng/api';

export interface ActivityType {
  id: number;
  type: string;
}

@Component({
  selector: 'app-inscriptions-challenges',
  templateUrl: './inscriptions-challenges.component.html',
  styleUrls: ['./inscriptions-challenges.component.scss'],
  providers: [MessageService]
})
export class InscriptionsChallengesComponent implements OnInit {
  challenges: AvailableChallenge[] = [];
  participatingChallenges: AvailableChallenge[] = [];

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  constructor(private challengesService: ChallengesService, private sportmanService: SportmenService, private messageService: MessageService, private sharedService: SharedService) { }

  ngOnInit() {
    // Requests database for all challenges
    this.challengesService.getAvailableChallengesVw(this.sharedService.getUsername()).subscribe({
      next: (availableChallenges) => {
        this.challenges = availableChallenges;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
      }
    })

    // Requests database for all user participating challenges
    this.sportmanService.getSportmanParticipatingChallenges(this.sharedService.getUsername()).subscribe({
      next: (participatingChallenges) => {
        this.participatingChallenges = participatingChallenges;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
      }
    })

    this.sortOptions = [
      { label: 'Name descending', value: 'name' },
      { label: 'Name ascending', value: '!name' },
      { label: 'Goal', value: 'goal' },
      { label: 'Start date', value: 'startDate' },
      { label: 'End date', value: 'endDate' }
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

  getDateOnFormat(date: string): string {
    return this.sharedService.formatDate2(date);
  }

  joinChallengeButtonOnClick(challengeName: string) {
    this.sportmanService.postSportmanChallengeInscription(challengeName, this.sharedService.getUsername()).subscribe({
      next: () => {
        this.sportmanService.getSportmanParticipatingChallenges(this.sharedService.getUsername()).subscribe({
          next: (participatingChallenges) => {
            this.participatingChallenges = participatingChallenges;
          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
          }
        })
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Username or challenge name wrong.' });
      }
    })
  }

  leaveChallengeButtonOnClick(challengeName: string) {
    this.sportmanService.deleteLeaveChallenge(challengeName, this.sharedService.getUsername()).subscribe({
      next: () => {
        this.sportmanService.getSportmanParticipatingChallenges(this.sharedService.getUsername()).subscribe({
          next: (participatingChallenges) => {
            this.participatingChallenges = participatingChallenges;
          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
          }
        })
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Username or challenge name wrong.' });
      }
    })
  }

  isUserParticipatingOnChallenge(challengeName: string): boolean {
    return this.participatingChallenges.some(participatingChallenge => participatingChallenge.name === challengeName);
  }
}

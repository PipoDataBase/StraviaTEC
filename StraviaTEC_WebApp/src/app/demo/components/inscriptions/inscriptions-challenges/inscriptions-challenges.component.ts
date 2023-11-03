import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { ProductService } from 'src/app/demo/service/product.service';

export interface Challenge {
  name: string,
  goal: number,
  private: boolean,
  startDate: string,
  endDate: string,
  deep: boolean,
  type: number
}

export interface ActivityType {
  id: number;
  type: string;
}

@Component({
  selector: 'app-inscriptions-challenges',
  templateUrl: './inscriptions-challenges.component.html',
  styleUrls: ['./inscriptions-challenges.component.scss']
})
export class InscriptionsChallengesComponent implements OnInit {
  challenges: Challenge[] = [];

  activities: ActivityType[] = []

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    // Requests database for all challenges
    this.challenges = [
      {
        name: 'Challenge1',
        goal: 1000,
        private: false,
        startDate: '11/01/2023',
        endDate: '11/30/2023',
        deep: true,
        type: 1
      },
      {
        name: 'Challenge2',
        goal: 5000,
        private: false,
        startDate: '11/01/2023',
        endDate: '11/30/2023',
        deep: true,
        type: 1
      },
      {
        name: 'Challenge3',
        goal: 10000,
        private: false,
        startDate: '11/01/2023',
        endDate: '11/30/2023',
        deep: true,
        type: 1
      },
      {
        name: 'Challenge4',
        goal: 1000,
        private: false,
        startDate: '11/01/2023',
        endDate: '11/30/2023',
        deep: false,
        type: 2
      },
      {
        name: 'Challenge5',
        goal: 2000,
        private: false,
        startDate: '11/01/2023',
        endDate: '11/30/2023',
        deep: false,
        type: 2
      },
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

  joinChallengeButtonOnClick(challengeName: string) {
    console.log("Joining Challenge " + challengeName)
  }

  getActivityType(id: number): string {
    const typeFounded = this.activities.find((type) => type.id == id);
    if (typeFounded) {
      return typeFounded.type;
    }
    return "";
  }

}

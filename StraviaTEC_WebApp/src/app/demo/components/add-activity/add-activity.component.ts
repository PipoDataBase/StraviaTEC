
import { Component } from '@angular/core';
import { ActivityType } from 'src/app/models/activity-type.module';
import { Activity } from 'src/app/models/activity.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { MessageService } from 'primeng/api';
import { ActivitiesService } from 'src/app/services/activities.service';
import { SharedService } from 'src/app/services/shared.service';
import { AvailableChallenge } from 'src/app/models/views-models/vw-available-challenge.module';
import { AvailableRace } from 'src/app/models/views-models/vw-available-race.module';
import { SportmenService } from 'src/app/services/sportmen.service';

export interface ActivityOption {
  id: string;
  type: string;
}

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss'],
  providers: [MessageService]
})
export class AddActivityComponent {
  activityTypes: ActivityType[] = [];
  activityOptions: ActivityOption[] = [];
  activity: Activity = {}

  selectedActivityType: number;
  selectedActivityOption: string;
  selectedRoute: string;

  myChallenges: AvailableChallenge[] = [];
  myRaces: AvailableRace[] = [];

  selectedChallenge: AvailableChallenge = {};
  selectedRace: AvailableRace = {};

  challenge: AvailableChallenge = {};
  race: AvailableRace = {};

  restartActivity() {
    this.activity = {
      id: -1,
      kilometers: 0,
      duration: '',
      date: '',
      routePath: '',
      description: '',
      username: '',
      raceName: '',
      challengeName: '',
      type: -1
    }

    this.selectedActivityOption = '';
    this.selectedActivityType = -1;
    this.selectedRoute = '';
    this.selectedChallenge = {};
    this.selectedRace = {};
  }

  constructor(private messageService: MessageService, private sharedService: SharedService, private activityTypesService: ActivityTypesService, private activitiesService: ActivitiesService, private sportmanService: SportmenService) { }

  ngOnInit(): void {
    this.restartActivity();

    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })

    this.activityOptions = [
      { id: 'Nothing', type: 'Nothing' },
      { id: 'Challenge', type: 'Challenge' },
      { id: 'Race', type: 'Race' }
    ];

    this.sportmanService.getSportmanParticipatingChallenges(this.sharedService.getUsername()).subscribe({
      next: (challenges) => {
        this.myChallenges = challenges;
        console.log(this.myChallenges);
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
      }
    })

    this.sportmanService.getSportmanJoinedRaces(this.sharedService.getUsername()).subscribe({
      next: (races) => {
        this.myRaces = races;
        console.log(this.myRaces);
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Races loaded wrong.' });
      }
    })
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

  addActivity() {
    if (this.validateActivity()) {
      this.activity.username = this.sharedService.getUsername();
      this.activitiesService.postActivity(this.activity).subscribe({
        next: (response) => {
          if (response) {
            this.restartActivity();
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Activity Added.', life: 3000 });
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

  validateActivity(): boolean {
    if (!this.activity.description) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Warn', detail: 'It is suggested to add a description to the activity.' });
    }

    if (!this.activity.date) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Activity date not selected.' });
      return false;
    }

    if (!this.selectedActivityType) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not selected an activity type.' });
      return false;
    }
    this.activity.type = this.selectedActivityType;

    if (!this.selectedActivityOption) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not selected what the activity belongs to.' });
      return false;
    }

    if (this.selectedActivityOption == 'Nothing') {
      this.activity.raceName = '';
      this.activity.challengeName = '';
    }

    if (this.selectedActivityOption == 'Challenge') {
      if (!this.selectedChallenge.name) {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not selected the challenge.' });
        return false;
      }

      if (this.selectedChallenge.type != this.sharedService.getActivityType(this.activityTypes, this.selectedActivityType)) {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The type of activity you selected and the one in the challenge do not match.' });
        return false;
      }

      this.activity.raceName = '';
      this.activity.challengeName = this.selectedChallenge.name;
    }

    if (this.selectedActivityOption == 'Race') {
      if (!this.selectedRace.name) {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not selected the race.' });
        return false;
      }

      if (this.selectedRace.type != this.sharedService.getActivityType(this.activityTypes, this.selectedActivityType)) {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The type of activity you selected and the one in the race do not match.' });
        return false;
      }

      var activityDate = new Date(this.activity.date);
      var raceDate = new Date(this.selectedRace.date);
      if (activityDate <= raceDate) {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The race has not happened yet.' });
        return false;
      }

      this.activity.raceName = this.selectedRace.name;
      this.activity.challengeName = '';
    }

    const validFormat = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(this.activity.duration);
    if (!validFormat) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Incorrect duration time.' });
      return false;
    }

    if (this.activity.kilometers <= 0) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Incorrect distance covered.' });
      return false;
    }

    if (this.selectedRoute == '') {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not added the .gpx file.' });
      return false;
    }
    this.activity.routePath = this.selectedRoute;

    return true;
  }
}

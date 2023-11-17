import { Component } from '@angular/core';
import { ActivityType } from 'src/app/models/activity-type.module';
import { Activity } from 'src/app/models/activity.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { MessageService } from 'primeng/api';
import { ActivitiesService } from 'src/app/services/activities.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss'],
  providers: [MessageService]
})
export class AddActivityComponent {
  activityTypes: ActivityType[] = [];
  activity: Activity = {
    id: -1,
    kilometers: -1,
    duration: '',
    date: '',
    routePath: '',
    description: '',
    username: '',
    raceName: '',
    challengeName: '',
    type: -1
  }

  selectedActivityType: number;

  constructor(private messageService: MessageService, private sharedService: SharedService, private activityTypesService: ActivityTypesService, private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  addActivity(description: string, date: string, duration: string, kilometers: number, route: any) {
    this.activity.description = description;
    this.activity.date = date;
    this.activity.type = this.selectedActivityType;
    this.activity.duration = duration;
    this.activity.kilometers = kilometers;
    this.activity.routePath = route; // Improve this

    if (this.validateActivity()) {
      this.activity.username = this.sharedService.getUsername();
      console.log(this.activity);
      this.activitiesService.postActivity(this.activity).subscribe({
        next: (response) => {
          if (response) {
            this.activity = {};
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

  // Need more validations
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

    const validFormat = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(this.activity.duration);
    if (!validFormat) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Incorrect duration time.' });
      return false;
    }

    if (this.activity.kilometers <= 0) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Incorrect distance covered.' });
      return false;
    }

    if (!this.activity.routePath) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'You have not added the .gpx file.' });
      return false;
    }

    return true;
  }
}

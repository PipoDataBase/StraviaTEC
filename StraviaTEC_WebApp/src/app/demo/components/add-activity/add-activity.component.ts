
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
  activity: Activity = {}

  selectedActivityType: number;
  selectedRoute: any;

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

    this.selectedActivityType = -1;
    this.selectedRoute = '';
  }

  constructor(private messageService: MessageService, private sharedService: SharedService, private activityTypesService: ActivityTypesService, private activitiesService: ActivitiesService) { }

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
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
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
    this.activity.type = this.selectedActivityType;

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

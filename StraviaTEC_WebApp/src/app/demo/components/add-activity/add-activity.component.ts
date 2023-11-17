import { Component } from '@angular/core';
import { ActivityType } from 'src/app/models/activity-type.module';
import { Activity } from 'src/app/models/activity.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent {
  activityTypes: ActivityType[] = [];
  activity: Activity = {}

  constructor(private activityTypesService: ActivityTypesService) { }

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

  addActivity(description: string, activityDate: string, duration: string, activityType: string, kilometers: string, route: string) {
    //validate data
    console.log(description, activityDate, duration, activityType, kilometers, route)
  }
}

import { Component } from '@angular/core';
import { ActivityType } from 'src/app/models/activity-type.module';
import { ActivityTypesService } from 'src/app/services/activity-types.service';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent {
  activityTypes: ActivityType[] = [];

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

  addActivity(description: string, activityDate: string, startTime: string, duration: string, activityType: string, kilometers: string, route: string) {
    //validate data
    console.log(description, activityDate, startTime, duration, activityType, kilometers, route)
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent {
  activityTypes = ['Run', 'Swim', 'Cycling', 'Hiking', 'Kayak', 'Hike'];

  addActivity(description: string, activityDate: string, startTime: string, duration: string, activityType: string, kilometers: string, route: string) {
    //validate data
    console.log(description, activityDate, startTime, duration, activityType, kilometers, route)
  }
}

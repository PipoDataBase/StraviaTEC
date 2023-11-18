import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivityType } from 'src/app/models/activity-type.module';
import { Activity } from 'src/app/models/activity.module';
import { Sportman } from 'src/app/models/sportman.module';
import { ActivitiesService } from 'src/app/services/activities.service';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { SharedService } from 'src/app/services/shared.service';
import { SportmenService } from 'src/app/services/sportmen.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  //showContent = true;
  activities: Activity[] = [];
  activityTypes: ActivityType[] = [];

  comments: { user: string; text: string }[] = [];
  newComment: string = '';
  value!: string;

  sportman: Sportman = {
    username: 'MarinGE23',
    name: 'Emanuel',
    lastName1: 'Marín',
    lastName2: 'Gutiérrez',
    birthDate: '2000-01-21',
    photoPath: 'https://firebasestorage.googleapis.com/v0/b/straviatec-942e3.appspot.com/o/profile%2FEmanuel.png?alt=media&token=4ef35ab0-380f-4d0b-8271-6d13a734887e',
    password: 'abc123de',
    nationality: 18 // Costa Rican
  }

  constructor(public sharedService: SharedService, private activityTypesService: ActivityTypesService, private activitiesService: ActivitiesService, private sportmenService: SportmenService) { }

  ngOnInit() {
    this.activitiesService.getActivities().subscribe({
      next: (activities) => {
        this.activities = activities;

        // We create an array of observables for the username of each activity
        const usernameObservables = this.activities.map(activity =>
          this.sportmenService.getSportman(activity.username)
        );

        // We use forkJoin to combine all observables into one
        forkJoin(usernameObservables).subscribe({
          next: (sportmenObject) => {
            // We assign the sportmen to each activity in the same order as the activities
            sportmenObject.forEach((sportmen, index) => {
              this.activities[index].routePath = 'https://www.google.com/maps/d/embed?mid=1cQv-iSgDnNCLG_jrQyX5emwZZDzLbixd&hl=es-419';
              this.activities[index].userInfo = sportmen;
            });
          },
          error: (response) => {
            console.log(response);
          }
        });

        console.log(this.activities);
      },
      error: (response) => {
        console.log(response);
        return;
      }
    })

    this.activityTypesService.getActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  addComment() {
    if (this.newComment.trim() !== '') {
      // Agregar el nuevo comentario a la lista
      this.comments.push({ user: 'Usuario', text: this.newComment });
      // Limpiar el área de comentarios
      this.newComment = '';
    }
  }
}

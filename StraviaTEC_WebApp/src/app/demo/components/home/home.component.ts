import { Component, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivityType } from 'src/app/models/activity-type.module';
import { Activity } from 'src/app/models/activity.module';
import { Sportman } from 'src/app/models/sportman.module';
import { ActivitiesService } from 'src/app/services/activities.service';
import { ActivityTypesService } from 'src/app/services/activity-types.service';
import { SharedService } from 'src/app/services/shared.service';
import { SportmenService } from 'src/app/services/sportmen.service';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { CommentsService } from 'src/app/services/comments.service';
import { _Comment } from 'src/app/models/comment.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  sportman: Sportman = {
    username: '',
    name: '',
    lastName1: '',
    lastName2: '',
    birthDate: '',
    photoPath: '',
    password: '',
    nationality: -1
  };

  activities: Activity[] = [];
  activityTypes: ActivityType[] = [];
  comments: _Comment[] = [];
  comment: _Comment = {};
  toComment: string;

  constructor(public sharedService: SharedService, private activityTypesService: ActivityTypesService, private activitiesService: ActivitiesService, private sportmenService: SportmenService, private commentsService: CommentsService) { }

  updateComments(activityId: number) {
    this.commentsService.GetCommentsByActivity(String(activityId)).subscribe({
      next: (comments) => {
        this.comments = comments;
        console.log(this.comments);
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

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
            //console.log(response);
          }
        });
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

    // Get sportman
    this.sportmenService.getSportman(this.sharedService.getUsername()).subscribe({
      next: (sportman) => {
        if (sportman.photoPath == '') sportman.photoPath = '../../../../assets/straviatec/default-avatar.png';
        this.sportman = sportman;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  handlePanelClick(panel: MatExpansionPanel, activityId: number): void {
    this.toComment = '';
    if (panel.expanded) {
      this.updateComments(activityId);
    }
  }

  addComment(activityId: number) {
    this.comment.name = this.sportman.username;
    this.comment.activityId = String(activityId);
    this.comment.text = this.toComment;

    this.commentsService.postComment(this.comment).subscribe({
      next: (response) => {
        if (response) {
          this.toComment = '';
          this.comment = {};
          this.updateComments(activityId);
        }
      },
      error: (response) => {
        console.log(response);
      }
    })
  }
}

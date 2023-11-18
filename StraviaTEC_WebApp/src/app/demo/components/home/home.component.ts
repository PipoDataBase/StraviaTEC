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
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  activities: Activity[] = [];
  comments: _Comment[] = [];
  activityTypes: ActivityType[] = [];

  sportman: Sportman = {};
  comment: _Comment = {};
  toComment: string;

  constructor(public sharedService: SharedService, private activityTypesService: ActivityTypesService, private activitiesService: ActivitiesService, private sportmenService: SportmenService, private commentsService: CommentsService) { }

  updateComments(activityId: number) {
    this.commentsService.GetCommentsByActivity(String(activityId)).subscribe({
      next: (comments) => {
        this.comments = comments;

        // We create an array of observables for the profile Photo of each user who comment
        const profilePhotoObservables = this.comments.map(comment =>
          this.sportmenService.getSportman(comment.name)
        );

        // We use forkJoin to combine all observables into one
        forkJoin(profilePhotoObservables).subscribe({
          next: (sportmenObject) => {
            // We assign the profilePhoto to each user who comment in the same order as the comments
            sportmenObject.forEach((sportmen, index) => {
              this.comments[index].profilePhoto = sportmen.photoPath ? sportmen.photoPath : '../../../../assets/straviatec/default-avatar.png';
            });
          },
          error: (response) => {
            console.log(response);
          }
        });
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

        // We create an array of observables for the user of each activity
        const userObservables = this.activities.map(activity =>
          this.sportmenService.getSportman(activity.username)
        );

        // We use forkJoin to combine all observables into one
        forkJoin(userObservables).subscribe({
          next: (sportmenObject) => {
            // We assign the sportmen to each activity in the same order as the activities
            sportmenObject.forEach((sportmen, index) => {
              this.activities[index].userInfo = sportmen;
            });
          },
          error: (response) => {
            console.log(response);
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

  parseGpxToJson(gpxString: string, id: number): void {
    const parser = new xml2js.Parser({ explicitArray: false });
    var cleanedString = gpxString.replace("\ufeff", "");

    parser.parseString(cleanedString, (error, result) => {
      if (error) {
        console.error('Error parsing GPX:', error);
      } else {
        // Your GPX data in JSON format
        const jsonData = result;

        this.createMap(jsonData, id);
      }
    })
  }

  createMap(jsonData: any, id: number) {
    const centerValue = jsonData.gpx.trk.trkseg.trkpt.length / 2

    const latCenter = jsonData.gpx.trk.trkseg.trkpt[centerValue.toFixed()].$.lat;
    const lonCenter = jsonData.gpx.trk.trkseg.trkpt[centerValue.toFixed()].$.lon;

    var mapValue = "map" + id;
    const map = new google.maps.Map(document.getElementById(mapValue), {
      center: { lat: Number(latCenter), lng: Number(lonCenter) }, // Set the initial center of the map
      zoom: 18 // Set the initial zoom level
    });

    var pathCoordinates = [];

    if (jsonData && jsonData.gpx.trk && jsonData.gpx.trk.trkseg && jsonData.gpx.trk.trkseg.trkpt) {
      const trkptArray = jsonData.gpx.trk.trkseg.trkpt;

      for (let index = 0; index < trkptArray.length; index++) {
        const element = trkptArray[index];
        const lat = element.$.lat;
        const lon = element.$.lon;
        const Latlng = new google.maps.LatLng(Number(lat), Number(lon));
        pathCoordinates[index] = Latlng
      }
    }

    const polyline = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    // Set the polyline on the map
    console.log(map);
    polyline.setMap(map);
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

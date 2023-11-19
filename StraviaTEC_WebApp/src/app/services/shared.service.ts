import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivityType } from '../models/activity-type.module';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from '../models/category.module';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private datePipe: DatePipe, private sanitizer: DomSanitizer) { }

  getUsername(): string {
    const data = localStorage.getItem('session');
    const session = JSON.parse(data);
    return session['username'];
  }

  formatDate(date: string): string {
    const result = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (result) {
      return result
    }
    return date;
  }

  formatDate2(date: string): string {
    const result = this.datePipe.transform(date, 'MM/dd/yyyy');
    if (result) {
      return result
    }
    return date;
  }

  formatDate3(date: string): string {
    const result = this.datePipe.transform(date, 'MM/dd/yyyy HH:mm');
    if (result) {
      return result
    }
    return date;
  }

  getActivityType(activityTypes: ActivityType[], id: number): string {
    const typeFound = activityTypes.find((type) => type.id == id);
    if (typeFound) {
      return typeFound.type;
    }
    return "";
  }

  getCategories(categories: Category[]): string {
    var result = "";
    categories.forEach(element => {
      result += element.category1 + ', '
    });

    if (result.length > 0) {
      result = result.slice(0, -2);
    }

    return result;
  }

  getCategory(categories: Category[], id: number): string {
    const categoryFound = categories.find((category) => category.id == id);
    if (categoryFound) {
      return categoryFound.category1;
    }
    return "";
  }

  getSafeResourceUrl(route: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(route);
  }

  parseGpxToJson(gpxString: string): void {
    const parser = new xml2js.Parser({ explicitArray: false });
    var cleanedString = gpxString.replace("\ufeff", "");

    parser.parseString(cleanedString, (error, result) => {
      if (error) {
        console.error('Error parsing GPX:', error);
      } else {
        // Your GPX data in JSON format
        const jsonData = result;

        this.createMap(jsonData);
      }
    })
  }

  createMap(jsonData: any) {
    const centerValue = jsonData.gpx.trk.trkseg.trkpt.length / 2

    const latCenter = jsonData.gpx.trk.trkseg.trkpt[centerValue.toFixed()].$.lat;
    const lonCenter = jsonData.gpx.trk.trkseg.trkpt[centerValue.toFixed()].$.lon;

    const map = new google.maps.Map(document.getElementById("map"), {
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
    polyline.setMap(map);
  }
}

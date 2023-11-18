import { Component, ElementRef, ViewChild } from '@angular/core';
import { GpxService } from 'src/app/services/gpx.service';
import { GoogleMap } from '@capacitor/google-maps'
import { environment } from 'src/environments/environment';
import {Loader} from '@googlemaps/js-api-loader'

@Component({
  selector: 'app-reports-races',
  templateUrl: './reports-races.component.html',
  styleUrls: ['./reports-races.component.scss']
})
export class ReportsRacesComponent {

  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;


constructor(private gpxService: GpxService){

}


onFileSelected(event: any) {


  const file: File = event.target.files[0];
 
     if (file) {
       const reader = new FileReader();
 
       reader.onload = (eventReader) => {
         const gpxString = eventReader.target?.result as string;
         var gpxinjson = this.gpxService.parseGpxToJson(gpxString, "map");
         this.createMap(gpxinjson);
       };
 
       reader.onerror = (error) => {
         console.error('Error reading file:', error);
       };
 
       reader.readAsText(file);
     }
   }
     

ionViewDidEnter(){
  //this.createMap();
  //console.log("ViewDidEnter")
}

async createMap(jsonData: any){

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 }, // Set the initial center of the map
    zoom: 8 // Set the initial zoom level
  });

  //console.log(jsonData.gpx.trk.trkseg.trkpt)
  if (jsonData && jsonData.trk && jsonData.trk.trkseg && jsonData.trk.trkseg.trkpt) {
  const trkptArray = jsonData.trk.trkseg.trkpt;
  console.log("parsing coordinates");
  if (trkptArray.length > 1) {
    const pathCoordinates = trkptArray.map((trkpt: any) => {
      return {
        lat: parseFloat(trkpt['@_lat']),
        lng: parseFloat(trkpt['@_lon'])
      };
    });

    console.log("Coordinates created! ",pathCoordinates);

    // Create a polyline and set its path


    console.log("creating Polylines");

    const polyline = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    // Set the polyline on the map
    polyline.setMap(map);

    // Fit the map bounds to the polyline
    const bounds = new google.maps.LatLngBounds();
    pathCoordinates.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds);
  }


  /*
  console.log("creating map")
  this.map = await GoogleMap.create({
    id: "my-map",
    apiKey: environment.googleMapsApiKey,
    element: this.mapRef.nativeElement,
    //forceCreate: true,
    config: {
      center:{
        lat: 33.6,
        lng: -117.9
      },
      zoom: 8
    }


  })
*/

/*
const loader = new Loader({
  apiKey: environment.googleMapsApiKey,
  version: "weekly",
  
});
let map: google.maps.Map;

loader.load().then(async () => {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
});
/*
const { Map } = await loader.importLibrary("maps") as google.maps.MapsLibrary;
map = new Map(document.getElementById("map") as HTMLElement, {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
});
*/
//console.log(map);

  }
}


}

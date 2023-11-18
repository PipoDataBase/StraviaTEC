//<reference types="googlemaps" />
import { Injectable } from '@angular/core';
//import * as togpx from 'togpx';
import * as xml2js from 'xml2js';
//import { GoogleMapsModule } from '@angular/google-maps';


@Injectable({
  providedIn: 'root'
})

/*interface jsonDATA{
  gpx: any,
  $:{version: string, xmlns: string},
  trk: {name:string, trkseg:{trkpt: { $:{lat:string, lon:string}}[]}}
}*/

export class GpxService {



  parseGpxToJson(gpxString: string,mapElementId: string): any {
    const parser = new xml2js.Parser({ explicitArray: false });
    var cleanedString = gpxString.replace("\ufeff","");//  replace("\ufeff", "");

    parser.parseString(cleanedString, (error, result) => {
      if (error) {
        console.error('Error parsing GPX:', error);
      } else {
        // Your GPX data in JSON format
        const jsonData = result;
        console.log('GPX Data in JSON:', jsonData);
        return jsonData;
        //this.createMap(mapElementId,jsonData);
        // Here, you can further process or use the JSON data as needed
      }
    })
}

createMap(mapElementId: string, jsonData: any): void{
  console.log("creating map");
  
  const map = new google.maps.Map(document.getElementById(mapElementId), {
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
//@ts-ignore
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
    //@ts-ignore
    const bounds = new google.maps.LatLngBounds();
    pathCoordinates.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds);
    console.log("map created");
  } else {
    console.error('GPX data must contain at least two trkpt elements for a polyline.');
  }

  }
}
}

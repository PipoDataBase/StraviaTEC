import { Component } from '@angular/core';

export interface Sportman {
  username: string;
  name: string;
  lastName1: string;
  lastName2: string;
  birthDate: string;
  photoPath: string;
  password: string;
  nationalityId: number;
}

export interface Group {
  name: string
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  // Functional variables

  private loadingAnimation = false;
  public getLoadingAnimation() {
    return this.loadingAnimation;
  }
  public setLoadingAnimation(value) {
    this.loadingAnimation = value;
  }

  private showSearchResults = false;
  public getShowSearchResults() {
    return this.showSearchResults;
  }
  public setShowSearchResults(value) {
    this.showSearchResults = value;
  }

  // Database variables

  private foundUsers: Sportman[];
  public getFoundUsers(): Sportman[] {
    return this.foundUsers;
  }
  public setFoundUsers(value: Sportman[]) {
    this.foundUsers = value;
  }

  private foundGroups: Group[];
  public getFoundGroups(): Group[] {
    return this.foundGroups;
  }
  public setFoundGroups(value: Group[]) {
    this.foundGroups = value;
  }

  //Other variables


  // Constructor


  // Search button function: Searches on database for a match of any user or group
  searchButtonOnClick(searchInputValue: String) {
    this.loadingAnimation = true;
    setTimeout(() => {
    this.loadingAnimation = false
    
    console.log("Searching '" + searchInputValue + "'...");

    // Database get

    // Search script for testing
    this.foundUsers = [
      {username: 'joseandres',
      name:'Andres',
      lastName1:'Rodriguez',
      lastName2:'R',
      birthDate:'',
      photoPath:'../../../../assets/straviatec/default-avatar.png',
      password:"",
      nationalityId:0},
      {username: 'emarin',
      name:'Ema',
      lastName1:'Marin',
      lastName2:'G',
      birthDate:'',
      photoPath:'../../../../assets/straviatec/default-avatar.png',
      password:"",
      nationalityId:0},
      {username: 'seballoll',
      name:'Sebas',
      lastName1:'Chen',
      lastName2:'C',
      birthDate:'',
      photoPath:'../../../../assets/straviatec/default-avatar.png',
      password:"",
      nationalityId:0},
      {username: 'camanem',
      name:'Oscar',
      lastName1:'Soto',
      lastName2:'?',
      birthDate:'',
      photoPath:'../../../../assets/straviatec/default-avatar.png',
      password:"",
      nationalityId:0},
    ]

    this.foundGroups = [
      {name: 'Group1'},
      {name: 'Group2'},
      {name: 'Group3'},
      {name: 'Group4'},
      {name: 'Group5'},
      {name: 'Group6'},
      {name: 'Group7'},
      {name: 'Group8'},
      {name: 'Group9'},
      {name: 'Group10'},
      {name: 'Group11'},
      {name: 'Group12'},
    ]

    this.showSearchResults = true
    
    }, 
    1000);
  }

  // Follow button function
  followUserButtonOnClick(username: string){
    // Database request

    console.log("Following user: " + username)
  }

  submitGroupButtonOnClick(name: string){
    // Database request

    console.log("Submited group: " + name)
  }
}

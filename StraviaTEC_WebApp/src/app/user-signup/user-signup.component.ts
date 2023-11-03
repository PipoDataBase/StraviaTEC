import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NationalitiesService } from '../services/nationalities.service';
import { Nationality } from '../models/nationality.module';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent {
  imagePath: any;
  imgURL: any;
  message: string = '';
  valid: boolean = true;
  nationalities: Nationality[] = [];

  constructor(private router: Router, private nationalitiesService: NationalitiesService) { }

  ngOnInit(): void {
    this.nationalitiesService.getNationalities().subscribe({
      next: (nationalities) => {
        this.nationalities = nationalities;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  register(name: string, lastName1: string, lastName2: string, nationality: string, birthDate: string, imgUrl: string, username: string, password: string): void {
    //validate data
    console.log(name, lastName1, lastName2, nationality, birthDate, imgUrl, username, password);
    var message = this.verifyData(name, lastName1, username, password);
    if (!this.valid) {
      alert(message);
      this.valid = true;
    }
    else {
      var url = "../../assets/straviatec/";
      if (imgUrl == "") {
        url = url + "default-avatar.png"
      }
      else {
        url = url + imgUrl.slice(12);
      }
    }
    this.router.navigate(["user-login"]);
  }

  toLogin(): void {
    this.router.navigate(["user-login"]);
  }

  verifyData(name, lname1, username, password) {
    var errorMessage = "Please enter a valid value of:";
    if (name == "") {
      errorMessage += "Name, ";
      this.valid = false;
    }
    if (lname1 == "") {
      errorMessage += "Lastname, ";
      this.valid = false;
    }
    if (username == "") {
      errorMessage += "Username, ";
      this.valid = false;
    }
    if (password == "") {
      errorMessage += "Password";
      this.valid = false;
    }

    if (errorMessage.slice(-2, -1) == ",") {
      errorMessage = errorMessage.slice(0, -2);
    }

    return errorMessage;
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NationalitiesService } from '../services/nationalities.service';
import { Nationality } from '../models/nationality.module';
import { SportmenService } from '../services/sportmen.service';
import { Sportman } from '../models/sportman.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss'],
  providers: [MessageService]
})
export class UserSignupComponent {
  imagePath: any;
  imgURL: any;
  message: string = '';
  valid: boolean = true;
  nationalities: Nationality[] = [];

  sportman: Sportman = {
    username: '',
    name: '',
    lastName1: '',
    lastName2: '',
    birthDate: '',
    photoPath: '',
    password: '',
    nationality: -1
  }

  constructor(private messageService: MessageService, private router: Router, private nationalitiesService: NationalitiesService, private sportmenService: SportmenService) { }

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

  register(name: string, lastName1: string, lastName2: string, nationality: number, birthDate: string, username: string, password: string): void {
    // Validate if there is empty data
    const message = this.verifyData(name, lastName1, username, password);
    if (!this.valid) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: message });
      this.valid = true;
      return;
    }

    // Validate if birthdate was selected
    if (birthDate == "") {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Birthdate not selected.' });
      return;
    }

    // Validate valid birthdate
    const currentDate = new Date();
    const inputDate = new Date(birthDate);
    const minAge = 7;
    if (inputDate >= currentDate || (currentDate.getFullYear() - inputDate.getFullYear()) < minAge) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The birthdate is not valid. Must be at least 7 years old.' });
      return;
    }

    // Add sportman info
    this.sportman.username = username;
    this.sportman.name = name;
    this.sportman.lastName1 = lastName1;
    this.sportman.lastName2 = lastName2;
    this.sportman.birthDate = birthDate;
    this.sportman.photoPath = '';
    this.sportman.password = password;
    this.sportman.nationality = nationality;

    // Post sportman
    this.sportmenService.postSportman(this.sportman).subscribe({
      next: (response) => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'You have been successfully registered!' });
        // Add a 3 second delay before navigation
        setTimeout(() => {
          this.router.navigate(["user-login"]);
        }, 3500);
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Username: ' + this.sportman.username + ' already used.' });
        return;
      }
    })
  }

  toLogin(): void {
    this.router.navigate(["user-login"]);
  }

  verifyData(name, lastName1, username, password) {
    var errorMessage = "Please enter a valid value of: ";
    if (name == "") {
      errorMessage += "Name, ";
      this.valid = false;
    }
    if (lastName1 == "") {
      errorMessage += "Lastname, ";
      this.valid = false;
    }
    if (username == "") {
      errorMessage += "Username, ";
      this.valid = false;
    }
    if (password == "") {
      errorMessage += "Password.";
      this.valid = false;
    }

    if (errorMessage.slice(-2, -1) == ",") {
      errorMessage = errorMessage.slice(0, -2);
      errorMessage += ".";
    }

    return errorMessage;
  }
}

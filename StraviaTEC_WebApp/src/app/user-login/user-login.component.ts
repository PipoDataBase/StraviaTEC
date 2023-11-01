import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {

  constructor(private router: Router) { }

  login(): void {
    console.log("Hola");
    this.router.navigate(["dashboard"]);
  }
}

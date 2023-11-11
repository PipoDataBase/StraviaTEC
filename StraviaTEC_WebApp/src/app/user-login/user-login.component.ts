import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  username: string = '';
  password: string = '';
  hide: boolean = true;

  constructor(private router: Router) { }

  login(username: string, password: string): void {
    //validate username and password
    console.log(username, password);
    const data = { id: 1, username: username }
    localStorage.setItem('session', JSON.stringify(data));
    this.router.navigate(["dashboard"]);
  }

  toRegister(): void {
    this.router.navigate(["user-signup"]);
  }
}

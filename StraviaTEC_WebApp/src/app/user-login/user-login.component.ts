import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SportmenService } from '../services/sportmen.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [MessageService]
})
export class UserLoginComponent {
  username: string = '';
  password: string = '';
  hide: boolean = true;

  constructor(private messageService: MessageService, private router: Router, private sportmenService: SportmenService) { }

  login(username: string, password: string): void {
    if (username == '') {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Username is empty.' });
      return;
    }

    if (password == '') {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Password is empty.' });
    }

    this.sportmenService.getSportman(username).subscribe({
      next: (sportman) => {
        if (sportman.password === password) {
          const data = { id: 1, username: username }
          localStorage.setItem('session', JSON.stringify(data));
          this.router.navigate(["dashboard"]);
        }
        else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Incorrect password.' });
        }
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Username or password incorrect.' });
      }
    })
  }

  toRegister(): void {
    this.router.navigate(["user-signup"]);
  }
}

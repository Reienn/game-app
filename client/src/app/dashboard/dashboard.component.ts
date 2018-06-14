import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.user = new User;
    this.user.name = '';
  }

  ngOnInit() {
    this.authenticationService.getDashboard().subscribe(
      user => {
        this.user.name = user.user.user.name;
      },
      err => {
        this.authenticationService.logout();
      });
  }

  newTable() {
    console.log('New table method');
  }

  logout() {
    this.authenticationService.logout();
  }
}

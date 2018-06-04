import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  constructor() {
    this.user = new User;
    this.user.name = 'Ala';
  }

  ngOnInit() {
  }

  newTable() {
    console.log('New table method');
  }
}

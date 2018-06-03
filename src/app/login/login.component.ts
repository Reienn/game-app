import { Component, OnInit } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  err: string;
  msg: string;
  constructor() { }

  ngOnInit() {
  }

  login() {
    console.log('login method');
  }

}

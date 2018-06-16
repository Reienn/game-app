import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  err: string;
  msg: string;
  user: any = {};

  constructor(
    private authenticationService: AuthenticationService,
    private authGuardService: AuthGuardService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard']);
    }
    if (this.authGuardService.getErr()) {
      this.err = this.authGuardService.getErr();
    }
    if (this.authenticationService.getMsg()) {
      this.msg = this.authenticationService.getMsg();
    }
  }

  login() {
    this.authenticationService.login(this.user.name, this.user.psw).subscribe(
      user => {
        this.router.navigate(['dashboard']);
      },
      err => {
        this.err = err;
      });
  }

}

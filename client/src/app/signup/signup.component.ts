import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  err: string;
  msg: string;
  user: any = {};
  constructor(
    private authenticationService: AuthenticationService,
    // private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['dashboard']);
    }
  }
  signup() {
    if (this.user.name && this.user.psw && this.user.psw2 && this.user.mail) {
      if (!/[^\s]{5,}/.test(this.user.name) ) {
        this.err = 'Nazwa musi mieć min. 5 znaków i nie zawierać spacji';
        return false;
      }

      if (!/[^\s]{7,}/.test(this.user.psw)) {
        this.err = 'Hasło musi mieć min. 7 znaków';
        return false;
      }

      if (this.user.psw !== this.user.psw2) {
        this.err = 'Hasła się różnią';
        return false;
      }

      this.authenticationService.signup(this.user.name, this.user.psw, this.user.mail).subscribe(
        user => {
          this.router.navigate(['login']);
        },
        err => {
          this.err = err;
        });
    }
  }

}

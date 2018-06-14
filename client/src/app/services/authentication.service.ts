import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  msg: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signup(name: string, psw: string, mail: string) {
    return this.http.post<any>('http://localhost:3000/signup', { name: name, psw: psw, mail: mail })
      .pipe(map((user: any) => {
        this.msg = 'Rejestracja pomyślna. Możesz się zalogować';
        return user;
      }), catchError((err) => {
        throw(err.error);
      })
    );
  }

  login(name: string, psw: string) {
    return this.http.post<any>('http://localhost:3000/login', { name: name, psw: psw })
      .pipe(map((user: any) => {
        if (user && user.token) {
          localStorage.setItem('currentUser', user.token);
          return user;
        }
      }), catchError((err) => {
        throw(err.error);
      })
    );
  }

  getDashboard() {
    return this.http.get<any>('http://localhost:3000/dashboard')
      .pipe(map((user: any) => {
        if (user) {
          return user;
        }
      }), catchError((err) => {
        throw(err.error);
      }));
  }

  logout() {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['']);
    }
  }

  getMsg() {
    return this.msg;
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  err: string;
  showLogin: boolean;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.router.url === '/login') {
      this.showLogin = true;
    } else if (this.router.url === '/signup') {
      this.showLogin = false;
    }

    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard']);
    }
  }

  display(display) {
    this.router.navigate(['/' + display]);
  }

}

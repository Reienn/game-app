import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  gamePlayList;
  constructor(
    private authenticationService: AuthenticationService,
    private socketService: SocketService,
    private router: Router
  ) {
    this.user = new User;
    this.user.name = '';
    this.gamePlayList = [];
  }

  ngOnInit() {
    this.authenticationService.getDashboard().subscribe(
      dashboard => {
        this.user.name = dashboard.dashboard.user.user.name;
        this.gamePlayList = dashboard.dashboard.gamePlayList;
      },
      err => {
        this.authenticationService.logout();
      });
  }

  newGamePlay() {
    this.authenticationService.newGamePlay().subscribe(
      gamePlayList => {
        this.gamePlayList = gamePlayList.gamePlayList;
      },
      err => {
        this.authenticationService.logout();
      });
  }

  enterGame(ev, gamePlayId) {
    this.router.navigate(['game/' + gamePlayId]);
  }

  logout() {
    this.authenticationService.logout();
  }
}

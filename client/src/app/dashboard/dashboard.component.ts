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
    private router: Router,
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {
    this.user = new User;
    this.user.name = '';
    this.gamePlayList = [];
  }

  ngOnInit() {
    this.authenticationService.authUser().subscribe(
      user => {
        this.user.name = user.user.user.name;
      },
      err => {
        this.authenticationService.logout();
      });

    this.socketService.setSocket();

    this.socketService.getGameList().subscribe(
      gameList => {
        this.gamePlayList = gameList;
      });
  }

  newGamePlay() {
    this.socketService.newGamePlay();
  }

  enterGame(ev, gamePlayId) {
    this.router.navigate(['game/' + gamePlayId]);
  }

  logout() {
    this.authenticationService.logout();
  }
}

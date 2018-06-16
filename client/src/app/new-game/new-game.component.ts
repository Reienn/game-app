import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  started: boolean;
  user: User;
  playersList: {
    waiting: Array<string>,
    ready: Array<string>,
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {
    this.user = new User;
    this.started = true;
  }

  ngOnInit() {
    this.user.name = '';
    this.playersList = {
      waiting: [],
      ready: []
    };

    this.socketService.setSocket();

    this.authenticationService.getDashboard().subscribe(
      dashboard => {
        this.user.name = dashboard.dashboard.user.user.name;
        this.socketService.updatePlayers({user: this.user.name, change: 'add_waiting'});
      },
      err => {
        this.authenticationService.logout();
      });

    this.socketService.getPlayers().subscribe(
      players => {
        this.playersList = players;
      }
    );
  }

  startGame() {
    console.log('Start game method');
  }

  leaveGame() {
    this.socketService.updatePlayers({user: this.user.name, change: 'remove_waiting'});
    this.router.navigate(['/dashboard']);

  }

  toggleNav() {
    console.log('Toggle nav method');
  }

}

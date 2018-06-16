import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  started: boolean;
  user: User;
  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.user = new User;
    this.user.name = '';
    this.started = true;
  }

  ngOnInit() {
    this.authenticationService.getDashboard().subscribe(
      dashboard => {
        this.user.name = dashboard.dashboard.user.user.name;
      },
      err => {
        this.authenticationService.logout();
      });
  }

  startGame() {
    console.log('Start game method');
  }

  leaveGame() {
    console.log('Leave game method');
  }

  toggleNav() {
    console.log('Toggle nav method');
  }

}

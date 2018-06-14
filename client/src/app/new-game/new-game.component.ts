import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  started: boolean;
  user: User;
  constructor() {
    this.user.name = 'Ala';
    this.started = false;
  }

  ngOnInit() {
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

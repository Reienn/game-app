import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit, OnDestroy {
  ready: boolean;
  active: boolean;
  isActivePlayer: boolean;
  answer: {
    player: string,
    answer: string,
  };
  user: User;
  playersList: {
    waiting: Array<string>,
    ready: Array<string>,
  };
  win: {
    user: string,
    message: string,
    status: boolean
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {
    this.user = new User;
    this.active = false;
    this.ready = false;
    this.isActivePlayer = false;
    this.answer = {
      player: '',
      answer: ''
    };
    this.win = {
      user: '',
      message: '',
      status: false
    };
  }

  ngOnInit() {
    this.user.name = '';
    this.playersList = {
      waiting: [],
      ready: []
    };
    this.socketService.setGroupSocket();

    this.authenticationService.authUser().subscribe(
      user => {
        this.user.name = user.user.user.name;
        this.socketService.updatePlayers({user: this.user.name, change: 'add_waiting'});
      },
      err => {
        this.authenticationService.logout();
      });

    this.socketService.getPlayers().subscribe(
      players => {
        console.log(players);
        this.playersList = players.players;
        if (players.active) {
          this.active = true;
        }
      }
    );

    this.socketService.getAnswer().subscribe(
      answerData => {
        this.active = true;
      }
    );

    this.socketService.getWin().subscribe(
      win => {
        this.win = win;
        this.socketService.updatePlayers({user: this.user.name, change: 'add_waiting'});
        this.socketService.updatePlayers({user: this.user.name, change: 'remove_ready'});
      }
    );
  }

  ngOnDestroy() {
    this.leaveGame();
  }

  startGame() {
    this.socketService.updatePlayers({user: this.user.name, change: 'remove_waiting'});
    this.socketService.updatePlayers({user: this.user.name, change: 'add_ready'});

    let indexW = this.playersList.waiting.indexOf(this.user.name);
    if (indexW > -1) {
      this.playersList.waiting.splice(indexW, 1);
    }

    this.ready = true;
  }

  nextTurn() {
    this.active = false;
    this.ready = false;
    this.win.status = false;
  }

  leaveGame() {
    this.socketService.updatePlayers({user: this.user.name, change: 'remove_waiting'});
    this.socketService.updatePlayers({user: this.user.name, change: 'remove_ready'});
    this.ready = false;
    this.router.navigate(['/dashboard']);

  }

}

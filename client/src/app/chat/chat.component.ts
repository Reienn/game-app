import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  user: User;
  answer: {
    player: string,
    answer: string
  };
  chat;
  isTyping;
  constructor(
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {
    this.user = new User;
  }

  ngOnInit() {
    this.user.name = '';
    this.answer = {
      player: '',
      answer: ''
    };
    this.isTyping = '';
    this.chat = [];
    this.authenticationService.authUser().subscribe(
      user => {
        this.user.name = user.user.user.name;
      },
      err => {
        this.authenticationService.logout();
      }
    );

    this.socketService.getAnswer().subscribe(
      answerData => {
        if (answerData.player === this.user.name) {
          this.answer.answer = answerData.answer;
        } else {
          this.answer.player = answerData.player;
        }
      }
    );

    this.socketService.getChat().subscribe(
      chat => {
        this.chat = chat;
      }
    );

    this.socketService.getTyping().subscribe(
      typing => {
        this.isTyping = typing;
      }
    );
  }

  sendMessage(message) {
    if (message !== '') {
      this.chat.push({user: this.user.name, message: message});
      this.socketService.sendMessage(this.user.name, message);
    }
  }

  typing() {
    this.socketService.typing(this.user.name);
  }

  notTyping() {
    this.socketService.notTyping(this.user.name);
  }

}
